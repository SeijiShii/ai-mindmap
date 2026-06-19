import { describe, it, expect, vi } from 'vitest';
import { makeMapsHandler } from './api-maps';
import { makeExpandHandler } from './api-expand';
import type { MapBackend, MapRow } from '../features/map-management/maps-repo';
import type { ChatFn } from '../ai/client';

const UUID = '00000000-0000-4000-8000-000000000000';

function mapsBackend(rows: MapRow[] = []): MapBackend {
  const m = new Map(rows.map((r) => [r.id, r]));
  let seq = rows.length;
  return {
    async listByOwner(o) { return [...m.values()].filter((r) => r.ownerId === o); },
    async getById(id) { return m.get(id) ?? null; },
    async insert(o, t) { const r = { id: `m${++seq}`, ownerId: o, title: t }; m.set(r.id, r); return r; },
    async rename() {},
    async remove() {},
  };
}

describe('makeMapsHandler (O57 / SEC-001)', () => {
  it('401 without session', async () => {
    const h = makeMapsHandler({ verify: async () => null, backend: mapsBackend() });
    expect((await h(new Request('https://x/api/maps'))).status).toBe(401);
  });
  it('GET lists only the owner maps', async () => {
    const h = makeMapsHandler({
      verify: async () => 'u1',
      backend: mapsBackend([{ id: 'm1', ownerId: 'u1', title: 'a' }, { id: 'm2', ownerId: 'u2', title: 'b' }]),
    });
    const res = await h(new Request('https://x/api/maps'));
    expect((await res.json()).maps.map((m: MapRow) => m.id)).toEqual(['m1']);
  });
  it('POST creates a map (201)', async () => {
    const h = makeMapsHandler({ verify: async () => 'u1', backend: mapsBackend() });
    const res = await h(new Request('https://x/api/maps', { method: 'POST', body: JSON.stringify({ title: 'X' }) }));
    expect(res.status).toBe(201);
    expect((await res.json()).map.title).toBe('X');
  });
});

const chatExpand: ChatFn = async () => ({
  content: JSON.stringify({ suggestions: [{ tempId: 't', parentRef: null, text: '関連案', kind: 'relation' }] }),
  usage: { inputTokens: 30, outputTokens: 10 },
});

describe('makeExpandHandler (O57 / quota)', () => {
  const base = {
    verify: async () => 'u1',
    loadNodes: async () => [{ id: 'nA', text: '対象', parentId: null }],
    isQuotaBlocked: async () => false,
    chat: chatExpand,
    saveNodes: vi.fn(async () => {}),
    recordUsage: vi.fn(async () => {}),
  };
  it('401 without session', async () => {
    const h = makeExpandHandler({ ...base, verify: async () => null });
    expect((await h(new Request('https://x/api/expand', { method: 'POST', body: JSON.stringify({ mapId: UUID, nodeId: UUID }) }))).status).toBe(401);
  });
  it('402 when quota blocked', async () => {
    const h = makeExpandHandler({ ...base, isQuotaBlocked: async () => true });
    expect((await h(new Request('https://x/api/expand', { method: 'POST', body: JSON.stringify({ mapId: UUID, nodeId: UUID }) }))).status).toBe(402);
  });
  it('200 returns branch suggestions', async () => {
    const h = makeExpandHandler(base);
    const res = await h(new Request('https://x/api/expand', { method: 'POST', body: JSON.stringify({ mapId: UUID, nodeId: UUID }) }));
    expect(res.status).toBe(200);
    expect((await res.json()).added).toBe(1);
  });
});
