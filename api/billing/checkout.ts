import { makeCheckoutHandler } from "../../src/app/api-billing";
import { createGuestOrClerkVerifier } from "../../src/auth/clerk";
import { createStripeCheckout } from "../../src/features/billing/stripe-client";


export default async function handler(req: Request): Promise<Response> {
  const env = process.env;
  return makeCheckoutHandler({
    verify: createGuestOrClerkVerifier(env.GUEST_TOKEN_SECRET!, env.CLERK_SECRET_KEY!, env.VITE_CLERK_PUBLISHABLE_KEY!),
    createCheckoutSession: createStripeCheckout(env.STRIPE_SECRET_KEY!),
  })(req);
}
