import { describe, it, expect } from "vitest";
import {
  signGuestToken,
  verifyGuestToken,
  newGuestSub,
  bearerToken,
} from "./guest-token";

const SECRET = "test-secret-0123456789abcdef";

describe("guest-token (§1.7 self-signed guest JWT)", () => {
  it("round-trips a guest sub", () => {
    const sub = newGuestSub();
    const tok = signGuestToken(sub, SECRET, 1_000_000_000_000);
    expect(verifyGuestToken(tok, SECRET, 1_000_000_000_000)).toBe(sub);
  });

  it("newGuestSub is prefixed and unique", () => {
    const a = newGuestSub();
    const b = newGuestSub();
    expect(a.startsWith("guest_")).toBe(true);
    expect(a).not.toBe(b);
  });

  it("rejects a token signed with a different secret (no forgery)", () => {
    const tok = signGuestToken(newGuestSub(), SECRET);
    expect(verifyGuestToken(tok, "other-secret")).toBeNull();
  });

  it("rejects a tampered payload", () => {
    const tok = signGuestToken("guest_aaa", SECRET);
    const [h, , s] = tok.split(".");
    const forged = `${h}.${Buffer.from(JSON.stringify({ sub: "guest_evil", iss: "ai-mindmap-guest", exp: 9e9 })).toString("base64url")}.${s}`;
    expect(verifyGuestToken(forged, SECRET)).toBeNull();
  });

  it("rejects an expired token", () => {
    const t0 = 1_000_000_000_000;
    const tok = signGuestToken("guest_x", SECRET, t0);
    const later = t0 + 200 * 24 * 3600 * 1000; // 200 days
    expect(verifyGuestToken(tok, SECRET, later)).toBeNull();
  });

  it("rejects a non-guest sub", () => {
    // hand-craft a token whose sub lacks the guest_ prefix
    const tok = signGuestToken("user_123", SECRET);
    expect(verifyGuestToken(tok, SECRET)).toBeNull();
  });

  it("bearerToken parses Authorization header", () => {
    const req = new Request("https://x.test", {
      headers: { authorization: "Bearer abc.def.ghi" },
    });
    expect(bearerToken(req)).toBe("abc.def.ghi");
    expect(bearerToken(new Request("https://x.test"))).toBeNull();
  });
});
