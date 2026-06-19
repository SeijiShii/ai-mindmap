/**
 * Stripe webhook handling logic (SPEC §4). Idempotent: a given event id only
 * tops up once. Signature verification is performed by the route handler using
 * the Stripe SDK before this logic runs; here we model the idempotent decision
 * so it is unit-testable without Stripe.
 */

export interface ProcessedEventStore {
  has(eventId: string): Promise<boolean>;
  mark(eventId: string): Promise<void>;
}

export interface TopupOutcome {
  applied: boolean;
  tokens: number;
}

/** Token grant per 100-yen pack (論点-001; tunable). */
export const TOKENS_PER_PACK = 10000;

export async function processCheckoutEvent(
  store: ProcessedEventStore,
  eventId: string,
  packs = 1,
): Promise<TopupOutcome> {
  if (await store.has(eventId)) {
    return { applied: false, tokens: 0 }; // idempotent: already processed
  }
  await store.mark(eventId);
  return { applied: true, tokens: TOKENS_PER_PACK * Math.max(1, packs) };
}
