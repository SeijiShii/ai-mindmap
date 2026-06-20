import { describe, it, expect, vi, beforeEach } from "vitest";

const initMock = vi.fn();
vi.mock("@sentry/react", () => ({ init: (...a: unknown[]) => initMock(...a) }));

import { scrubEvent, initSentry } from "./sentry";
import type { ErrorEvent } from "@sentry/react";

beforeEach(() => initMock.mockReset());

describe("scrubEvent (SEC-003 PII masking)", () => {
  it("masks PII in message, exception value and breadcrumbs", () => {
    const ev = {
      message: "失敗 a@b.com",
      exception: { values: [{ value: "連絡先 090-1234-5678 が無効" }] },
      breadcrumbs: [{ message: "user typed 123456789012" }],
    } as unknown as ErrorEvent;
    const out = scrubEvent(ev);
    expect(out.message).toBe("失敗 [メール]");
    expect(out.exception!.values![0]!.value).toContain("[電話番号]");
    expect(out.breadcrumbs![0]!.message).toContain("[番号]");
  });

  it("drops request body/cookies/query and free-form extras (may hold thought text)", () => {
    const ev = {
      request: { data: { transcript: "私の悩み" }, cookies: "s=1", query_string: "q=x" },
      extra: { node: "秘密の思考" },
    } as unknown as ErrorEvent;
    const out = scrubEvent(ev);
    expect(out.request!.data).toBeUndefined();
    expect(out.request!.cookies).toBeUndefined();
    expect(out.request!.query_string).toBeUndefined();
    expect(out.extra).toEqual({});
  });
});

describe("initSentry (O01, dormant without DSN)", () => {
  it("does not init and returns false when no DSN", () => {
    expect(initSentry(undefined)).toBe(false);
    expect(initMock).not.toHaveBeenCalled();
  });

  it("inits with a PII-scrubbing beforeSend when DSN present", () => {
    expect(initSentry("https://k@sentry.test/1", "production")).toBe(true);
    expect(initMock).toHaveBeenCalledOnce();
    const cfg = initMock.mock.calls[0]![0] as {
      beforeSend: (e: ErrorEvent) => ErrorEvent;
      sendDefaultPii: boolean;
    };
    expect(cfg.sendDefaultPii).toBe(false);
    const scrubbed = cfg.beforeSend({ message: "x a@b.com" } as ErrorEvent);
    expect(scrubbed.message).toBe("x [メール]");
  });
});
