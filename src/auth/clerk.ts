import { createClerkClient } from "@clerk/backend";
import type { SessionVerifier } from "./owner";
import { bearerToken, verifyGuestToken } from "./guest-token";

/**
 * Owner resolution for protected routes. Guests use a self-signed guest JWT
 * (§1.7, Clerk-decoupled, no owner churn); linked accounts use Clerk. The
 * verifier tries the guest JWT on the Authorization header first, then falls
 * back to Clerk's authenticateRequest. SEC-001: the subject is always verified
 * server-side (guest secret / Clerk session), never trusted from raw input.
 */
export function createGuestOrClerkVerifier(
  guestSecret: string,
  clerkSecretKey: string,
  clerkPublishableKey: string,
): SessionVerifier {
  const clerk = createClerkClient({
    secretKey: clerkSecretKey,
    publishableKey: clerkPublishableKey,
  });
  return async (req) => {
    const tok = bearerToken(req);
    if (tok) {
      const sub = verifyGuestToken(tok, guestSecret);
      if (sub) return sub; // valid guest JWT → owner = sub
    }
    // Not a guest token → real Clerk session (cookie or Bearer Clerk JWT).
    const res = await clerk.authenticateRequest(req);
    return res.toAuth()?.userId ?? null;
  };
}
