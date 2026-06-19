import { describe, it, expect, vi } from 'vitest';
import { makeStructureHandler, type StructureDeps } from './api-structure';
import type { ChatFn } from '../ai/client';

const UUID = '00000000-0000-4000-8000-000000000000';
const chatOk: ChatFn = async () => ({
  content: JSON.stringify({ suggestions: [{ tempId: 't1', parentRef: null, text: '新しい要点', kind: 'tree' }] }),
  usage: { inputTokens: 50, outputTokens: 20 },
});

function deps(over: Partial<StructureDeps> = {}): StructureDeps {
  return {
    verify: async () => 'user_1',
    loadNodes: async () => [],
    isQuotaBlocked: async () => false,
    chat: chatOk,
    saveNodes: vi.fn(async () => {}),
    recordUsage: vi.fn(async () => {}),
    ...over,
  };
}

function reqWith(body: unknown) {
  return new Request('https://x.test/api/structure', { method: 'POST', body: JSON.stringify(body) });
}

describe('makeStructureHandler (O57 composition / P4.46 / SEC-004)', () => {
  it('APP-S3 / P4.46: 401 without a session (real gate, not stub bypass)', async () => {
    const h = makeStructureHandler(deps({ verify: async () => null }));
    const res = await h(reqWith({ mapId: UUID, transcriptDelta: 'hi' }));
    expect(res.status).toBe(401);
  });

  it('400 on invalid input (SEC-002 boundary)', async () => {
    const h = makeStructureHandler(deps());
    const res = await h(reqWith({ mapId: 'not-a-uuid', transcriptDelta: 'hi' }));
    expect(res.status).toBe(400);
  });

  it('AS-S3 / SEC-004: 402 when quota is blocked', async () => {
    const h = makeStructureHandler(deps({ isQuotaBlocked: async () => true }));
    const res = await h(reqWith({ mapId: UUID, transcriptDelta: 'hi' }));
    expect(res.status).toBe(402);
    expect((await res.json()).upgrade).toBe(true);
  });

  it('AS-S1: 200 adds merged nodes + records usage', async () => {
    const save = vi.fn(async () => {});
    const record = vi.fn(async () => {});
    const h = makeStructureHandler(deps({ saveNodes: save, recordUsage: record }));
    const res = await h(reqWith({ mapId: UUID, transcriptDelta: '会議の要点' }));
    expect(res.status).toBe(200);
    expect((await res.json()).added).toBe(1);
    expect(save).toHaveBeenCalledOnce();
    expect(record).toHaveBeenCalledOnce();
  });

  it('AS-S2: empty delta adds nothing (no-op, cost saved) but still 200', async () => {
    const save = vi.fn(async () => {});
    const h = makeStructureHandler(deps({ saveNodes: save }));
    const res = await h(reqWith({ mapId: UUID, transcriptDelta: '   ' }));
    expect(res.status).toBe(200);
    expect((await res.json()).added).toBe(0);
    expect(save).not.toHaveBeenCalled();
  });
});
