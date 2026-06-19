import { describe, it, expect } from 'vitest';
import { getOwnerId, requireOwner, AuthError, type SessionVerifier } from './owner';
import { ensureUser, linkAccount, type UserStore, type UserRecord } from './ensure-user';

const req = new Request('https://x.test/api/maps');

describe('owner resolution (SEC-001 / P4.46)', () => {
  it('N1/N3: requireOwner returns ownerId for an authed session', async () => {
    const verify: SessionVerifier = async () => 'user_abc';
    expect(await requireOwner(verify, req)).toBe('user_abc');
    expect(await getOwnerId(verify, req)).toBe('user_abc');
  });
  it('E1: requireOwner throws 401 when no session (no stub bypass)', async () => {
    const verify: SessionVerifier = async () => null;
    await expect(requireOwner(verify, req)).rejects.toBeInstanceOf(AuthError);
    try {
      await requireOwner(verify, req);
    } catch (e) {
      expect((e as AuthError).status).toBe(401);
    }
    expect(await getOwnerId(verify, req)).toBeNull();
  });
});

function fakeStore(seed: UserRecord[] = []): UserStore & { rows: Map<string, UserRecord> } {
  const rows = new Map<string, UserRecord>(seed.map((r) => [r.id, r]));
  return {
    rows,
    async find(id) {
      return rows.get(id) ?? null;
    },
    async insert(rec) {
      rows.set(rec.id, rec);
    },
    async setGuest(id, isGuest) {
      const r = rows.get(id);
      if (r) rows.set(id, { ...r, isGuest });
    },
  };
}

describe('ensureUser (FK guarantee)', () => {
  it('N2: inserts a guest user for a new owner', async () => {
    const store = fakeStore();
    await ensureUser(store, 'user_new');
    expect(store.rows.get('user_new')).toEqual({ id: 'user_new', isGuest: true });
  });
  it('B1: idempotent on repeated calls', async () => {
    const store = fakeStore([{ id: 'user_x', isGuest: true }]);
    await ensureUser(store, 'user_x');
    expect(store.rows.size).toBe(1);
  });
});

describe('linkAccount (N4: guest→account, id 不変)', () => {
  it('promotes a guest to a linked account keeping the same id', async () => {
    const store = fakeStore([{ id: 'user_g', isGuest: true }]);
    await linkAccount(store, 'user_g');
    expect(store.rows.get('user_g')).toEqual({ id: 'user_g', isGuest: false });
  });
  it('creates a non-guest row if none exists', async () => {
    const store = fakeStore();
    await linkAccount(store, 'user_g2');
    expect(store.rows.get('user_g2')?.isGuest).toBe(false);
  });
});
