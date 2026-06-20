import { makeWebhookHandler } from "../../src/app/api-billing";
import { createDb } from "../../src/db/client";
import { serverDeps } from "../../src/app/server-deps";
import { verifyStripeWebhook } from "../../src/features/billing/stripe-client";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const env = process.env;
  const db = createDb(env.DATABASE_URL!);
  const deps = serverDeps(db, env, () => new Date());
  return makeWebhookHandler({
    verifyEvent: verifyStripeWebhook(
      env.STRIPE_SECRET_KEY!,
      env.STRIPE_WEBHOOK_SECRET!,
    ),
    store: deps.processedEventStore,
    grantTopup: deps.grantTopup,
  })(req);
}
