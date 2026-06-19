import { describe, it, expect } from 'vitest';
import { createMapsRepo, OwnerScopeError, type MapBackend, type MapRow } from './maps-repo';

function backend(rows: MapRow[] = []): MapBackend {
  const m = new Map(rows.map((r) => [r.id, r]));
  let seq = rows.length;
  return {
    async listByOwner(owner) {
      return [...m.values()].filter((r) => r.ownerId === owner);
    },
    async getById(id) {
      return m.get(id) ?? null;
    },
    async insert(owner, title) {
      const row = { id: `m${++seq}`, ownerId: owner, title };
      m.set(row.id, row);
      return row;
    },
    async rename(id, title) {
      const r = m.get(id);
      if (r) m.set(id, { ...r, title });
    },
    async remove(id) {
      m.delete(id);
    },
  };
}

describe('map-management repo (SEC-001 owner scope)', () => {
  it('N1: list returns only the owner maps', async () => {
    const repo = createMapsRepo(
      backend([
        { id: 'm1', ownerId: 'u1', title: 'a' },
        { id: 'm2', ownerId: 'u2', title: 'b' },
      ]),
    );
    const mine = await repo.list('u1');
    expect(mine.map((r) => r.id)).toEqual(['m1']);
  });

  it('N2: create defaults the title', async () => {
    const repo = createMapsRepo(backend());
    const created = await repo.create('u1');
    expect(created.title).toBe('無題のマップ');
    expect(created.ownerId).toBe('u1');
  });

  it("E1: getting another owner's map throws 404 (no leakage)", async () => {
    const repo = createMapsRepo(backend([{ id: 'm1', ownerId: 'u2', title: 'secret' }]));
    await expect(repo.get('u1', 'm1')).rejects.toBeInstanceOf(OwnerScopeError);
  });

  it("E1: renaming another owner's map throws", async () => {
    const repo = createMapsRepo(backend([{ id: 'm1', ownerId: 'u2', title: 'x' }]));
    await expect(repo.rename('u1', 'm1', 'hacked')).rejects.toBeInstanceOf(OwnerScopeError);
  });

  it('owner can rename + delete own map', async () => {
    const be = backend([{ id: 'm1', ownerId: 'u1', title: 'x' }]);
    const repo = createMapsRepo(be);
    await repo.rename('u1', 'm1', 'new');
    expect((await be.getById('m1'))?.title).toBe('new');
    await repo.remove('u1', 'm1');
    expect(await be.getById('m1')).toBeNull();
  });
});
