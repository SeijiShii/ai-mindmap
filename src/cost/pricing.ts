/**
 * §4.6.2 cost estimation. Unit prices live in env (never hardcoded) so they can
 * be updated without code changes. tokens × price = estimated USD.
 */
export interface Rates {
  inputPer1k: number;
  outputPer1k: number;
}

const DEFAULTS: Rates = { inputPer1k: 0.00015, outputPer1k: 0.0006 };

export function ratesFromEnv(env: Record<string, string | undefined>): Rates {
  const input = Number(env.COST_OPENAI_GPT4O_MINI_PER_1K_INPUT_TOKENS);
  const output = Number(env.COST_OPENAI_GPT4O_MINI_PER_1K_OUTPUT_TOKENS);
  return {
    inputPer1k: Number.isFinite(input) && input >= 0 ? input : DEFAULTS.inputPer1k,
    outputPer1k: Number.isFinite(output) && output >= 0 ? output : DEFAULTS.outputPer1k,
  };
}

export function estimateCost(inputTokens: number, outputTokens: number, rates: Rates): number {
  const cost = (inputTokens / 1000) * rates.inputPer1k + (outputTokens / 1000) * rates.outputPer1k;
  // round to 6 decimals (matches usage_log numeric(10,6))
  return Math.round(cost * 1e6) / 1e6;
}
