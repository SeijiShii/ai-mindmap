import {
  getStoredGuestToken,
  storeGuestToken,
} from "./guest-store";

/**
 * §1.7 guest bootstrap (Clerk-decoupled). Returns a stable guest token: reuse the
 * persisted one if present (no churn), otherwise provision a new one via
 * POST /api/auth/guest and persist it. The fetch is injected (O35) so the
 * orchestration is testable without a network/localStorage.
 */
export interface GuestSessionPorts {
  getStored: () => string | null;
  fetchToken: () => Promise<{ guestToken: string }>;
  store: (token: string) => void;
}

export async function ensureGuestToken(
  ports: GuestSessionPorts,
): Promise<string> {
  const existing = ports.getStored();
  if (existing) return existing; // stable owner — reuse, no churn
  const { guestToken } = await ports.fetchToken();
  ports.store(guestToken);
  return guestToken;
}

/** Production ports: localStorage + POST /api/auth/guest. */
export function browserGuestPorts(): GuestSessionPorts {
  return {
    getStored: getStoredGuestToken,
    store: storeGuestToken,
    fetchToken: async () => {
      const stored = getStoredGuestToken();
      const res = await fetch("/api/auth/guest", {
        method: "POST",
        headers: stored ? { authorization: `Bearer ${stored}` } : {},
      });
      if (!res.ok) throw new Error(`guest provision failed: ${res.status}`);
      return res.json();
    },
  };
}
