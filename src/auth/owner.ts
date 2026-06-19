/**
 * SEC-001 / P4.46 owner resolution. The session verifier is injectable so the
 * resolution + 401 logic is unit-testable without Clerk; production passes a
 * Clerk-backed verifier (src/auth/clerk.ts).
 */

export class AuthError extends Error {
  readonly status: number;
  constructor(message = 'unauthorized', status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/** Resolves a request to a Clerk userId (= ownerId) or null when unauthenticated. */
export type SessionVerifier = (req: Request) => Promise<string | null>;

export async function getOwnerId(verify: SessionVerifier, req: Request): Promise<string | null> {
  return verify(req);
}

/** Like getOwnerId but throws AuthError(401) when there is no session. */
export async function requireOwner(verify: SessionVerifier, req: Request): Promise<string> {
  const ownerId = await verify(req);
  if (!ownerId) throw new AuthError();
  return ownerId;
}
