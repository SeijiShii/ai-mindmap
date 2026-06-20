import { describe, it, expect, vi } from "vitest";
import { establishGuestSession } from "./guest-session";

describe("establishGuestSession (O22 A bootstrap)", () => {
  it("fetches a ticket, completes sign-in, and activates the session", async () => {
    const setActive = vi.fn(async () => {});
    const sessionId = await establishGuestSession({
      fetchTicket: async () => ({ ticket: "tkt_1" }),
      createSignIn: async (t) => {
        expect(t).toBe("tkt_1");
        return { createdSessionId: "sess_1" };
      },
      setActive,
    });
    expect(sessionId).toBe("sess_1");
    expect(setActive).toHaveBeenCalledWith("sess_1");
  });

  it("propagates a ticket fetch failure (no session activated)", async () => {
    const setActive = vi.fn(async () => {});
    await expect(
      establishGuestSession({
        fetchTicket: async () => {
          throw new Error("guest endpoint 500");
        },
        createSignIn: async () => ({ createdSessionId: "x" }),
        setActive,
      }),
    ).rejects.toThrow();
    expect(setActive).not.toHaveBeenCalled();
  });
});
