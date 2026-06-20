import { makeGuestHandler } from "../../src/app/api-guest";
import { createDb } from "../../src/db/client";
import { serverDeps } from "../../src/app/server-deps";

/**
 * POST /api/auth/guest — §1.7 self-signed guest provision (no Clerk createUser).
 * Returns a long-lived guest JWT the client persists; the owner sub is stable
 * across reloads/expiry (no owner churn).
 */
export default async function handler(req: Request): Promise<Response> {
  const env = process.env;
  const db = createDb(env.DATABASE_URL!);
  const deps = serverDeps(db, env, () => new Date());
  return makeGuestHandler({
    guestSecret: env.GUEST_TOKEN_SECRET!,
    ensureUser: deps.ensureUser,
  })(req);
}
