import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";

/**
 * §1.7 guest identity (CF-20260617-001): self-signed guest JWT, decoupled from
 * Clerk. ai-mindmap is owner-scoped (maps owned by the auth subject), so a Clerk
 * session as the guest owner would churn on session expiry → orphaned data. A
 * long-lived server-signed token keeps the owner `sub` stable across reloads and
 * token expiry. SEC-001 safe: the client holds an opaque server-signed token; the
 * secret is server-only so `sub` cannot be forged (verified, never trusted raw).
 */

const ISS = "ai-mindmap-guest";
const TTL_SEC = 180 * 24 * 3600; // 180 days
const PREFIX = "guest_";

function b64urlJson(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

export function newGuestSub(): string {
  return PREFIX + randomUUID();
}

export function signGuestToken(
  sub: string,
  secret: string,
  now: number = Date.now(),
): string {
  const header = b64urlJson({ alg: "HS256", typ: "JWT" });
  const iat = Math.floor(now / 1000);
  const payload = b64urlJson({ sub, iss: ISS, iat, exp: iat + TTL_SEC });
  const data = `${header}.${payload}`;
  const sig = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

/** Returns the guest `sub` if the token is a valid, unexpired guest JWT, else null. */
export function verifyGuestToken(
  token: string,
  secret: string,
  now: number = Date.now(),
): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;
  const expected = createHmac("sha256", secret)
    .update(`${h}.${p}`)
    .digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  let payload: { sub?: unknown; iss?: unknown; exp?: unknown };
  try {
    payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (payload.iss !== ISS) return null;
  if (typeof payload.exp !== "number" || payload.exp < Math.floor(now / 1000))
    return null;
  if (typeof payload.sub !== "string" || !payload.sub.startsWith(PREFIX))
    return null;
  return payload.sub;
}

/** Extracts a Bearer token from an Authorization header, or null. */
export function bearerToken(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1]!.trim() : null;
}
