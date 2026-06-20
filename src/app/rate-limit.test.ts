import { describe, it, expect } from 'vitest';
import {
  createMemoryRateLimiter,
  makeRateLimited,
  clientIp,
  type RateLimitConfig,
} from './rate-limit';
import { makeStructureHandler, type StructureDeps } from './api-structure';
import { makeExpandHandler, type ExpandDeps } from './api-expand';
import type { ChatFn } from '../ai/client';

const UUID = '00000000-0000-4000-8000-000000000000';
const chatOk: ChatFn = async () => ({
  content: JSON.stringify({ suggestions: [] }),
  usage: { inputTokens: 1, outputTokens: 1 },
});

const tinyCfg: RateLimitConfig = { ownerMax: 3, ownerWindowMs: 1000, ipMax: 3, ipWindowMs: 1000 };

function reqFrom(ip: string) {
  return new Request('https://x.test/api/structure', {
    method: 'POST',
    headers: { 'x-forwarded-for': ip },
    body: JSON.stringify({ mapId: UUID, transcriptDelta: 'hi' }),
  });
}

describe('rate-limit (SEC-004 / O27)', () => {
  it('R1: within max is not blocked', () => {
    const rl = createMemoryRateLimiter();
    for (let i = 0; i < 3; i++) expect(rl.check('k', 3, 1000, 0)).toBe(false);
  });

  it('R2: window expiry resets the count', () => {
    const rl = createMemoryRateLimiter();
    for (let i = 0; i < 3; i++) rl.check('k', 3, 1000, 0);
    expect(rl.check('k', 3, 1000, 5)).toBe(true); // 4th within window
    expect(rl.check('k', 3, 1000, 2000)).toBe(false); // window elapsed
  });

  it('R3: same owner over limit is blocked', async () => {
    let t = 0;
    const rateLimited = makeRateLimited(createMemoryRateLimiter(), () => t, tinyCfg);
    const req = reqFrom('1.1.1.1');
    for (let i = 0; i < 3; i++) expect(await rateLimited('owner_a', req)).toBe(false);
    expect(await rateLimited('owner_a', req)).toBe(true);
  });

  it('R4: different owners sharing an IP are blocked by the IP bucket', async () => {
    let t = 0;
    const rateLimited = makeRateLimited(createMemoryRateLimiter(), () => t, tinyCfg);
    const req = reqFrom('9.9.9.9');
    expect(await rateLimited('o1', req)).toBe(false);
    expect(await rateLimited('o2', req)).toBe(false);
    expect(await rateLimited('o3', req)).toBe(false);
    expect(await rateLimited('o4', req)).toBe(true); // 4th hit on ip:9.9.9.9
  });

  it('R5: the exact boundary hit (max+1) is the first blocked one', () => {
    const rl = createMemoryRateLimiter();
    expect(rl.check('k', 3, 1000, 0)).toBe(false);
    expect(rl.check('k', 3, 1000, 0)).toBe(false);
    expect(rl.check('k', 3, 1000, 0)).toBe(false);
    expect(rl.check('k', 3, 1000, 0)).toBe(true);
  });

  it('clientIp prefers the first x-forwarded-for entry', () => {
    expect(clientIp(reqFrom('2.2.2.2, 3.3.3.3'))).toBe('2.2.2.2');
  });
});

function sDeps(over: Partial<StructureDeps> = {}): StructureDeps {
  return {
    verify: async () => 'user_1',
    rateLimited: async () => false,
    loadNodes: async () => [],
    isQuotaBlocked: async () => false,
    chat: chatOk,
    saveNodes: async () => {},
    recordUsage: async () => {},
    ...over,
  };
}
function eDeps(over: Partial<ExpandDeps> = {}): ExpandDeps {
  return {
    verify: async () => 'user_1',
    rateLimited: async () => false,
    loadNodes: async () => [],
    isQuotaBlocked: async () => false,
    chat: chatOk,
    saveNodes: async () => {},
    recordUsage: async () => {},
    ...over,
  };
}

describe('handlers return 429 when rate limited', () => {
  it('R6: structure handler → 429 + Retry-After', async () => {
    const h = makeStructureHandler(sDeps({ rateLimited: async () => true }));
    const res = await h(reqFrom('1.1.1.1'));
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBeTruthy();
    expect((await res.json()).error).toBe('rate_limited');
  });

  it('R7: expand handler → 429', async () => {
    const h = makeExpandHandler(eDeps({ rateLimited: async () => true }));
    const req = new Request('https://x.test/api/expand', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.1.1.1' },
      body: JSON.stringify({ mapId: UUID, nodeId: UUID, mode: 'expand' }),
    });
    expect((await h(req)).status).toBe(429);
  });

  it('R8: auth (401) takes precedence over rate limit', async () => {
    const h = makeStructureHandler(sDeps({ verify: async () => null, rateLimited: async () => true }));
    expect((await h(reqFrom('1.1.1.1'))).status).toBe(401);
  });
});
