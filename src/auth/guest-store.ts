/**
 * §1.7 client persistence of the guest identity. The guest JWT lives in
 * localStorage so the owner `sub` survives reloads and auth-session expiry —
 * this is what prevents owner churn (CF-20260617-001). Cleared only when the
 * guest links a real account (then Clerk takes over).
 */
const KEY = "aimindmap.guestToken";

export function getStoredGuestToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function storeGuestToken(token: string): void {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* private mode / storage disabled — degrade to per-session */
  }
}

export function clearGuestToken(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
