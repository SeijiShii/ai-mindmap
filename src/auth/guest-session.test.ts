import { describe, it, expect, vi } from "vitest";
import { ensureGuestToken } from "./guest-session";

describe("ensureGuestToken (§1.7 stable guest, no churn)", () => {
  it("reuses the stored token without provisioning (no churn)", async () => {
    const fetchToken = vi.fn(async () => ({ guestToken: "new" }));
    const store = vi.fn();
    const tok = await ensureGuestToken({
      getStored: () => "stored.token",
      fetchToken,
      store,
    });
    expect(tok).toBe("stored.token");
    expect(fetchToken).not.toHaveBeenCalled();
    expect(store).not.toHaveBeenCalled();
  });

  it("provisions + persists when there is no stored token", async () => {
    const store = vi.fn();
    const tok = await ensureGuestToken({
      getStored: () => null,
      fetchToken: async () => ({ guestToken: "minted.token" }),
      store,
    });
    expect(tok).toBe("minted.token");
    expect(store).toHaveBeenCalledWith("minted.token");
  });

  it("propagates a provision failure (nothing stored)", async () => {
    const store = vi.fn();
    await expect(
      ensureGuestToken({
        getStored: () => null,
        fetchToken: async () => {
          throw new Error("guest endpoint 500");
        },
        store,
      }),
    ).rejects.toThrow();
    expect(store).not.toHaveBeenCalled();
  });
});
