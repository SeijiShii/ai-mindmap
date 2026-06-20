import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { ensureGuestToken, browserGuestPorts } from "./guest-session";

/**
 * Returns a `getToken()` that yields the Bearer token for /api calls:
 * a Clerk session token when the user is signed in (linked account), otherwise
 * the persisted guest JWT (§1.7) — provisioned on first use. The server verifier
 * accepts both (guest JWT → sub, else Clerk).
 */
export function useAuthToken(): () => Promise<string | null> {
  const { isSignedIn, getToken } = useAuth();
  return useCallback(async () => {
    if (isSignedIn) {
      const t = await getToken();
      if (t) return t;
    }
    return ensureGuestToken(browserGuestPorts());
  }, [isSignedIn, getToken]);
}
