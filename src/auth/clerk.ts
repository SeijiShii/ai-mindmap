import { createClerkClient } from '@clerk/backend';
import type { SessionVerifier } from './owner';

/**
 * P4.46 production guest-session path. Real Clerk integration (not a stub): a
 * Clerk-backed SessionVerifier for protected routes, plus server-side creation
 * of an anonymous user + sign-in ticket so guests get a real authenticated
 * session (guest-auth-clerk-scaffold pattern).
 */

export function createClerkVerifier(secretKey: string, publishableKey: string): SessionVerifier {
  const clerk = createClerkClient({ secretKey, publishableKey });
  return async (req) => {
    const res = await clerk.authenticateRequest(req);
    const auth = res.toAuth();
    return auth?.userId ?? null;
  };
}

export interface GuestTicket {
  userId: string;
  ticket: string;
}

/**
 * Create an anonymous guest user and a sign-in ticket. The frontend completes
 * the session with signIn.create({ strategy: 'ticket', ticket }). Same Clerk
 * userId persists after account linking, so guest data carries over (O22).
 */
export async function createGuestSession(secretKey: string): Promise<GuestTicket> {
  const clerk = createClerkClient({ secretKey });
  const user = await clerk.users.createUser({
    skipPasswordRequirement: true,
    publicMetadata: { guest: true },
  });
  const token = await clerk.signInTokens.createSignInToken({
    userId: user.id,
    expiresInSeconds: 60 * 10,
  });
  return { userId: user.id, ticket: token.token };
}
