import { requireOwner, AuthError, type SessionVerifier } from "../auth/owner";
import {
  processCheckoutEvent,
  type ProcessedEventStore,
} from "../features/billing/webhook";

/**
 * Composition of the billing routes (O57). Stripe access is injected (O35) so the
 * full path — checkout creation and webhook signature verification — is testable
 * without Stripe. SEC: webhook signature is verified (偽装防止, SPEC §4); event id
 * idempotency prevents double top-up; checkout requires an owner (guest ok).
 */

export interface CheckoutDeps {
  verify: SessionVerifier;
  /** Returns a Stripe Checkout URL for `packs` of the 100-yen token pack. */
  createCheckoutSession: (
    ownerId: string,
    packs: number,
    origin: string,
  ) => Promise<string>;
}

export function makeCheckoutHandler(deps: CheckoutDeps) {
  return async (req: Request): Promise<Response> => {
    let ownerId: string;
    try {
      ownerId = await requireOwner(deps.verify, req);
    } catch (e) {
      if (e instanceof AuthError) return json({ error: "unauthorized" }, 401);
      throw e;
    }
    const body = (await req.json().catch(() => ({}))) as { pack?: unknown };
    const packs = Math.max(1, Math.min(10, Number(body?.pack) || 1));
    const url = await deps.createCheckoutSession(
      ownerId,
      packs,
      new URL(req.url).origin,
    );
    return json({ url }, 200);
  };
}

/** Thrown by a verifyEvent implementation when the Stripe signature is invalid. */
export class WebhookSignatureError extends Error {}

export interface WebhookEvent {
  id: string;
  type: string;
  ownerId: string | null;
  packs: number;
}

export interface WebhookDeps {
  /** Verifies the Stripe signature; throws WebhookSignatureError if invalid. */
  verifyEvent: (payload: string, signature: string | null) => WebhookEvent;
  store: ProcessedEventStore;
  grantTopup: (ownerId: string, tokens: number) => Promise<void>;
}

export function makeWebhookHandler(deps: WebhookDeps) {
  return async (req: Request): Promise<Response> => {
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: WebhookEvent;
    try {
      event = deps.verifyEvent(payload, sig);
    } catch (e) {
      // O64 state 1: invalid signature → 400 (forged / tampered, reject)
      if (e instanceof WebhookSignatureError)
        return json({ error: "invalid_signature" }, 400);
      throw e;
    }

    // O64 state 2: signature valid but event is not ours → 200 ack (do not 4xx,
    // else Stripe retries forever and disables the endpoint)
    if (event.type !== "checkout.session.completed" || !event.ownerId) {
      return json({ received: true, ignored: true }, 200);
    }

    // O64 state 3: valid + relevant → idempotent top-up
    const outcome = await processCheckoutEvent(deps.store, event.id, event.packs);
    if (outcome.applied) await deps.grantTopup(event.ownerId, outcome.tokens);
    return json({ received: true, applied: outcome.applied }, 200);
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
