/**
 * O54 self-service deletion: a guest's data is deletable only by themselves
 * (the operator cannot identify the person). This plans the owner-scoped delete;
 * the store is injectable so the cascade order is testable without a live DB.
 */

export interface DeletionStore {
  /** Delete all maps (and cascading nodes/edges) for an owner. Returns count. */
  deleteMaps(ownerId: string): Promise<number>;
  /** Delete usage_log rows for an owner. */
  deleteUsage(ownerId: string): Promise<number>;
  /** Delete the user row. */
  deleteUser(ownerId: string): Promise<void>;
}

export interface DeletionResult {
  mapsDeleted: number;
  usageDeleted: number;
}

/** Delete everything owned by ownerId. Idempotent (0 rows is fine). */
export async function deleteAllData(store: DeletionStore, ownerId: string): Promise<DeletionResult> {
  if (!ownerId) throw new Error('owner required');
  const mapsDeleted = await store.deleteMaps(ownerId); // cascades nodes/edges
  const usageDeleted = await store.deleteUsage(ownerId);
  await store.deleteUser(ownerId);
  return { mapsDeleted, usageDeleted };
}
