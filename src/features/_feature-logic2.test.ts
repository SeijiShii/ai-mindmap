import { describe, it, expect } from 'vitest';
import { buildNodeContext } from './ai-expand/context-builder';
import { processCheckoutEvent, TOKENS_PER_PACK, type ProcessedEventStore } from './billing/webhook';
import { prepareFeedback } from './feedback/context';
import { deleteAllData, type DeletionStore } from './legal/delete-account';

describe('ai-expand context-builder', () => {
  const nodes = [
    { id: 'p', parentId: null, text: '親テーマ' },
    { id: 't', parentId: 'p', text: '対象ノード' },
    { id: 's', parentId: 'p', text: '兄弟ノード' },
    { id: 'c', parentId: 't', text: '子ノード' },
  ];
  it('includes target, parent, siblings, children', () => {
    const ctx = buildNodeContext(nodes, 't');
    expect(ctx).toContain('対象: 対象ノード');
    expect(ctx).toContain('親: 親テーマ');
    expect(ctx).toContain('兄弟: 兄弟ノード');
    expect(ctx).toContain('既存の子: 子ノード');
  });
  it('returns empty for unknown node', () => {
    expect(buildNodeContext(nodes, 'ghost')).toBe('');
  });
});

describe('billing webhook (idempotent topup)', () => {
  function store(seen: string[] = []): ProcessedEventStore {
    const s = new Set(seen);
    return { async has(id) { return s.has(id); }, async mark(id) { s.add(id); } };
  }
  it('N2: grants tokens on first event', async () => {
    const r = await processCheckoutEvent(store(), 'evt_1');
    expect(r).toEqual({ applied: true, tokens: TOKENS_PER_PACK });
  });
  it('E2: same event id is idempotent (no double topup)', async () => {
    const s = store(['evt_1']);
    expect(await processCheckoutEvent(s, 'evt_1')).toEqual({ applied: false, tokens: 0 });
  });
});

describe('feedback prepareFeedback (SEC-003 scrub)', () => {
  it('scrubs PII from text and UA before send', () => {
    const out = prepareFeedback('ai-mindmap', {
      kind: 'bug',
      text: '連絡先 a@b.com',
      context: { route: '/map/1', appVersion: '0.1', userAgent: 'UA a@b.com', at: 't' },
    });
    expect(out.service).toBe('ai-mindmap');
    expect(out.text).not.toContain('a@b.com');
    expect(out.context.userAgent).not.toContain('a@b.com');
  });
});

describe('legal deleteAllData (O54 self-service, owner-scoped)', () => {
  it('cascades maps + usage + user', async () => {
    const calls: string[] = [];
    const store: DeletionStore = {
      async deleteMaps(o) { calls.push(`maps:${o}`); return 3; },
      async deleteUsage(o) { calls.push(`usage:${o}`); return 5; },
      async deleteUser(o) { calls.push(`user:${o}`); },
    };
    const r = await deleteAllData(store, 'user_x');
    expect(r).toEqual({ mapsDeleted: 3, usageDeleted: 5 });
    expect(calls).toEqual(['maps:user_x', 'usage:user_x', 'user:user_x']);
  });
  it('requires an owner', async () => {
    const store = {} as DeletionStore;
    await expect(deleteAllData(store, '')).rejects.toThrow();
  });
});
