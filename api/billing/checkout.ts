import { makeCheckoutHandler } from "../../src/app/api-billing";
import { createClerkVerifier } from "../../src/auth/clerk";
import { createStripeCheckout } from "../../src/features/billing/stripe-client";

export const config = { runtime: "nodejs" };

export default async function handler(req: Request): Promise<Response> {
  const env = process.env;
  return makeCheckoutHandler({
    verify: createClerkVerifier(
      env.CLERK_SECRET_KEY!,
      env.VITE_CLERK_PUBLISHABLE_KEY!,
    ),
    createCheckoutSession: createStripeCheckout(env.STRIPE_SECRET_KEY!),
  })(req);
}
