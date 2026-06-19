/**
 * Upsert a users row for an owner so FK-bearing inserts (maps/usage_log) never
 * fail. Idempotent. The store is injectable (O35) for testability; production
 * wires _shared/db.
 */

export interface UserRecord {
  id: string;
  isGuest: boolean;
}

export interface UserStore {
  find(id: string): Promise<UserRecord | null>;
  insert(rec: UserRecord): Promise<void>;
  setGuest(id: string, isGuest: boolean): Promise<void>;
}

/** Ensure a user row exists (guest by default). Idempotent. */
export async function ensureUser(store: UserStore, ownerId: string, isGuest = true): Promise<void> {
  const existing = await store.find(ownerId);
  if (!existing) {
    await store.insert({ id: ownerId, isGuest });
  }
}

/** Promote a guest to a linked account (data carries over: same id, O22). */
export async function linkAccount(store: UserStore, ownerId: string): Promise<void> {
  const existing = await store.find(ownerId);
  if (!existing) {
    await store.insert({ id: ownerId, isGuest: false });
    return;
  }
  if (existing.isGuest) await store.setGuest(ownerId, false);
}
