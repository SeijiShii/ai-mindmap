/**
 * §4.6.2 / SEC-004 quota management. The DB is abstracted behind an injectable
 * store (perspectives O35) so the consume/reset logic is unit-testable without a
 * live database; the real implementation wires _shared/db.
 */

export interface QuotaState {
  freeTokensRemaining: number;
  topupTokensRemaining: number;
  freeTokensResetAt: Date;
}

export interface QuotaStore {
  get(ownerId: string): Promise<QuotaState | null>;
  set(ownerId: string, state: QuotaState): Promise<void>;
}

export interface QuotaConfig {
  /** Monthly free token allowance. */
  monthlyFreeTokens: number;
}

export interface QuotaCheck {
  remaining: number;
  /** Percentage of the monthly free allowance already consumed (0-100+). */
  usedPct: number;
  blocked: boolean;
}

function addOneMonth(d: Date): Date {
  const n = new Date(d.getTime());
  n.setMonth(n.getMonth() + 1);
  return n;
}

/** Lazily refill the monthly free allowance if the reset time has passed. */
function applyLazyReset(state: QuotaState, now: Date, cfg: QuotaConfig): QuotaState {
  if (now >= state.freeTokensResetAt) {
    return {
      freeTokensRemaining: cfg.monthlyFreeTokens,
      topupTokensRemaining: state.topupTokensRemaining,
      freeTokensResetAt: addOneMonth(now),
    };
  }
  return state;
}

export async function checkQuota(
  store: QuotaStore,
  ownerId: string,
  now: Date,
  cfg: QuotaConfig,
): Promise<QuotaCheck> {
  const raw = (await store.get(ownerId)) ?? {
    freeTokensRemaining: cfg.monthlyFreeTokens,
    topupTokensRemaining: 0,
    freeTokensResetAt: addOneMonth(now),
  };
  const state = applyLazyReset(raw, now, cfg);
  const remaining = state.freeTokensRemaining + state.topupTokensRemaining;
  const used = cfg.monthlyFreeTokens - state.freeTokensRemaining;
  const usedPct = cfg.monthlyFreeTokens > 0 ? Math.round((used / cfg.monthlyFreeTokens) * 100) : 0;
  return { remaining, usedPct, blocked: remaining <= 0 };
}

export interface ConsumeResult {
  ok: boolean;
  source: 'free' | 'topup' | 'mixed' | 'none';
}

/** Consume tokens: free allowance first, then top-up. Atomic via store.set. */
export async function consumeQuota(
  store: QuotaStore,
  ownerId: string,
  tokens: number,
  now: Date,
  cfg: QuotaConfig,
): Promise<ConsumeResult> {
  const raw = (await store.get(ownerId)) ?? {
    freeTokensRemaining: cfg.monthlyFreeTokens,
    topupTokensRemaining: 0,
    freeTokensResetAt: addOneMonth(now),
  };
  const state = applyLazyReset(raw, now, cfg);
  if (state.freeTokensRemaining + state.topupTokensRemaining < tokens) {
    return { ok: false, source: 'none' };
  }
  const fromFree = Math.min(state.freeTokensRemaining, tokens);
  const fromTopup = tokens - fromFree;
  await store.set(ownerId, {
    freeTokensRemaining: state.freeTokensRemaining - fromFree,
    topupTokensRemaining: state.topupTokensRemaining - fromTopup,
    freeTokensResetAt: state.freeTokensResetAt,
  });
  const source: ConsumeResult['source'] =
    fromFree > 0 && fromTopup > 0 ? 'mixed' : fromTopup > 0 ? 'topup' : 'free';
  return { ok: true, source };
}

/** Add purchased top-up tokens (billing webhook). */
export async function addTopup(
  store: QuotaStore,
  ownerId: string,
  tokens: number,
  now: Date,
  cfg: QuotaConfig,
): Promise<void> {
  const raw = (await store.get(ownerId)) ?? {
    freeTokensRemaining: cfg.monthlyFreeTokens,
    topupTokensRemaining: 0,
    freeTokensResetAt: addOneMonth(now),
  };
  await store.set(ownerId, {
    ...raw,
    topupTokensRemaining: raw.topupTokensRemaining + tokens,
  });
}

/** Alert thresholds (80/100/120% of monthly free allowance consumed). */
export function alertLevel(usedPct: number): 80 | 100 | 120 | null {
  if (usedPct >= 120) return 120;
  if (usedPct >= 100) return 100;
  if (usedPct >= 80) return 80;
  return null;
}
