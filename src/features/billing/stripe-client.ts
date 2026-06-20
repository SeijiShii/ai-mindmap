import Stripe from "stripe";
import {
  WebhookSignatureError,
  type WebhookEvent,
} from "../../app/api-billing";

/**
 * Real Stripe bindings for the billing routes (injected at the api/ edge, O35).
 * PWYW single 100-yen pack (charter §1). Success/cancel URLs derive from the
 * request origin so there is no placeholder env to misconfigure (CF-20260531-002).
 *
 * Edge-runtime compatible: a fetch-based HTTP client (no Node http) and the async
 * SubtleCrypto signature verifier (constructEventAsync). The api/* functions run
 * on Vercel's edge runtime, which bundles extensionless ESM imports (avoids the
 * O51 ERR_MODULE_NOT_FOUND trap that hits nodejs zero-config functions).
 */

const UNIT_AMOUNT_JPY = 100;

function edgeStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, { httpClient: Stripe.createFetchHttpClient() });
}

export function createStripeCheckout(secretKey: string) {
  const stripe = edgeStripe(secretKey);
  return async (
    ownerId: string,
    packs: number,
    origin: string,
  ): Promise<string> => {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: packs,
          price_data: {
            currency: "jpy",
            unit_amount: UNIT_AMOUNT_JPY,
            product_data: { name: "AI 追加トークン枠（買い切り）" },
          },
        },
      ],
      client_reference_id: ownerId,
      metadata: { ownerId, packs: String(packs) },
      success_url: `${origin}/?topup=success`,
      cancel_url: `${origin}/?topup=cancel`,
    });
    if (!session.url) throw new Error("stripe checkout: no session url");
    return session.url;
  };
}

export function verifyStripeWebhook(secretKey: string, webhookSecret: string) {
  const stripe = edgeStripe(secretKey);
  const cryptoProvider = Stripe.createSubtleCryptoProvider();
  return async (
    payload: string,
    signature: string | null,
  ): Promise<WebhookEvent> => {
    if (!signature) throw new WebhookSignatureError("missing stripe-signature");
    let event: Stripe.Event;
    try {
      // Edge runtime: async SubtleCrypto verifier (constructEvent is Node-only).
      event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret,
        undefined,
        cryptoProvider,
      );
    } catch {
      throw new WebhookSignatureError("invalid stripe signature");
    }
    const obj = event.data.object as {
      client_reference_id?: string | null;
      metadata?: Record<string, string> | null;
    };
    const ownerId = obj?.client_reference_id ?? obj?.metadata?.ownerId ?? null;
    const packs = Number(obj?.metadata?.packs) || 1;
    return { id: event.id, type: event.type, ownerId, packs };
  };
}
