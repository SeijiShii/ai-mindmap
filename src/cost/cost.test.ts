import { describe, it, expect } from "vitest";
import { estimateCost, ratesFromEnv } from "./pricing";
import {
  checkQuota,
  consumeQuota,
  addTopup,
  alertLevel,
  type QuotaStore,
  type QuotaState,
} from "./quota";

const CFG = { monthlyFreeTokens: 10000 };

function fakeStore(initial: Record<string, QuotaState> = {}): QuotaStore {
  const m = new Map<string, QuotaState>(Object.entries(initial));
  return {
    async get(id) {
      return m.get(id) ?? null;
    },
    async set(id, s) {
      m.set(id, s);
    },
  };
}

describe("pricing (§4.6.2)", () => {
  it("N1: estimateCost = tokens × env rate", () => {
    const rates = { inputPer1k: 0.00015, outputPer1k: 0.0006 };
    expect(estimateCost(1000, 1000, rates)).toBeCloseTo(0.00075, 6);
  });
  it("E3: ratesFromEnv falls back to defaults when missing", () => {
    const r = ratesFromEnv({});
    expect(r.inputPer1k).toBeGreaterThan(0);
    expect(r.outputPer1k).toBeGreaterThan(0);
  });
  it("ratesFromEnv reads env values", () => {
    const r = ratesFromEnv({
      COST_OPENAI_GPT4O_MINI_PER_1K_INPUT_TOKENS: "0.001",
      COST_OPENAI_GPT4O_MINI_PER_1K_OUTPUT_TOKENS: "0.002",
    });
    expect(r).toEqual({ inputPer1k: 0.001, outputPer1k: 0.002 });
  });
});

describe("quota (SEC-004)", () => {
  const now = new Date("2026-06-19T00:00:00Z");

  it("N3: consume free first then topup (mixed)", async () => {
    const store = fakeStore({
      u1: {
        freeTokensRemaining: 100,
        topupTokensRemaining: 100,
        freeTokensResetAt: new Date("2026-07-19T00:00:00Z"),
      },
    });
    const r = await consumeQuota(store, "u1", 150, now, CFG);
    expect(r).toEqual({ ok: true, source: "mixed" });
    const s = await store.get("u1");
    expect(s).toMatchObject({
      freeTokensRemaining: 0,
      topupTokensRemaining: 50,
    });
  });

  it("E1: blocked when exhausted", async () => {
    const store = fakeStore({
      u1: {
        freeTokensRemaining: 0,
        topupTokensRemaining: 0,
        freeTokensResetAt: new Date("2026-07-19T00:00:00Z"),
      },
    });
    const check = await checkQuota(store, "u1", now, CFG);
    expect(check.blocked).toBe(true);
    const r = await consumeQuota(store, "u1", 10, now, CFG);
    expect(r.ok).toBe(false);
  });

  it("N4: lazy monthly reset refills free allowance", async () => {
    const store = fakeStore({
      u1: {
        freeTokensRemaining: 0,
        topupTokensRemaining: 0,
        freeTokensResetAt: new Date("2026-06-01T00:00:00Z"),
      },
    });
    const check = await checkQuota(store, "u1", now, CFG); // now > resetAt
    expect(check.remaining).toBe(CFG.monthlyFreeTokens);
    expect(check.blocked).toBe(false);
  });

  it("new user defaults to full free allowance", async () => {
    const store = fakeStore();
    const check = await checkQuota(store, "new", now, CFG);
    expect(check.remaining).toBe(CFG.monthlyFreeTokens);
  });

  it("addTopup increments topup (billing webhook)", async () => {
    const store = fakeStore();
    await addTopup(store, "u1", 500, now, CFG);
    const s = await store.get("u1");
    expect(s?.topupTokensRemaining).toBe(500);
  });

  it("B2: alertLevel fires at thresholds", () => {
    expect(alertLevel(50)).toBeNull();
    expect(alertLevel(80)).toBe(80);
    expect(alertLevel(100)).toBe(100);
    expect(alertLevel(130)).toBe(120);
  });
});
