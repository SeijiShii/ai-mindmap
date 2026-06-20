import { describe, it, expect, vi } from "vitest";
import { makeGuestHandler } from "./api-guest";
import { signGuestToken, verifyGuestToken } from "../auth/guest-token";

const SECRET = "guest-secret-xyz";

function req(auth?: string) {
  return new Request("https://x.test/api/auth/guest", {
    method: "POST",
    headers: auth ? { authorization: `Bearer ${auth}` } : {},
  });
}

describe("makeGuestHandler (§1.7 provision)", () => {
  it("mints a new guest owner + seeds the user row", async () => {
    const ensureUser = vi.fn(async () => {});
    const res = await makeGuestHandler({ guestSecret: SECRET, ensureUser })(req());
    expect(res.status).toBe(200);
    const body = (await res.json()) as { guestToken: string; ownerId: string };
    expect(body.ownerId.startsWith("guest_")).toBe(true);
    expect(verifyGuestToken(body.guestToken, SECRET)).toBe(body.ownerId);
    expect(ensureUser).toHaveBeenCalledWith(body.ownerId);
  });

  it("reuses the same sub when a valid guest token is presented (no churn)", async () => {
    const ensureUser = vi.fn(async () => {});
    const tok = signGuestToken("guest_stable", SECRET);
    const res = await makeGuestHandler({ guestSecret: SECRET, ensureUser })(req(tok));
    const body = (await res.json()) as { ownerId: string };
    expect(body.ownerId).toBe("guest_stable");
  });

  it("mints fresh when the presented token is invalid", async () => {
    const ensureUser = vi.fn(async () => {});
    const res = await makeGuestHandler({ guestSecret: SECRET, ensureUser })(
      req("not.a.token"),
    );
    const body = (await res.json()) as { ownerId: string };
    expect(body.ownerId.startsWith("guest_")).toBe(true);
    expect(body.ownerId).not.toBe("guest_stable");
  });
});
