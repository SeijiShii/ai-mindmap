import Stripe from "stripe";
import {
  WebhookSignatureError,
  type WebhookEvent,
} from "../../app/api-billing";

/**
 * Real Stripe bindings for the billing routes (injected at the api/ edge, O35).
 * PWYW single 100-yen pack (charter §1). Success/cancel URLs derive from the
 * request origin so there is no placeholder env to misconfigure (CF-20260531-002).
 */

const UNIT_AMOUNT_JPY = 100;

export function createStripeCheckout(secretKey: string) {
  const stripe = new Stripe(secretKey);
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
  const stripe = new Stripe(secretKey);
  return (payload: string, signature: string | null): WebhookEvent => {
    if (!signature) throw new WebhookSignatureError("missing stripe-signature");
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
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
