import {
  bearerToken,
  verifyGuestToken,
  signGuestToken,
  newGuestSub,
} from "../auth/guest-token";

/**
 * POST /api/auth/guest — provision (or refresh) a guest identity (§1.7). No Clerk
 * createUser (no MAU, no 422 on production instances, no owner churn). If the
 * request already carries a valid guest JWT, the same `sub` is re-signed (stable
 * owner). Otherwise a new `guest_<uuid>` owner is minted and a users row seeded.
 */
export interface GuestDeps {
  guestSecret: string;
  ensureUser: (ownerId: string) => Promise<void>;
  now?: () => number;
}

export function makeGuestHandler(deps: GuestDeps) {
  return async (req: Request): Promise<Response> => {
    const existing = bearerToken(req);
    let sub = existing ? verifyGuestToken(existing, deps.guestSecret) : null;
    if (!sub) sub = newGuestSub();
    await deps.ensureUser(sub);
    const guestToken = signGuestToken(sub, deps.guestSecret, deps.now?.());
    return new Response(JSON.stringify({ guestToken, ownerId: sub }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
}
