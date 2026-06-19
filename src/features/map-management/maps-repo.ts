import { assertOwner, OwnerScopeError } from '../../db/with-owner';

/**
 * Owner-scoped map operations (SEC-001). All reads/writes go through ownerId;
 * fetching another owner's map throws OwnerScopeError(404). Backend ops are
 * injectable (O35) so this composition is testable without a live DB.
 */

export interface MapRow {
  id: string;
  ownerId: string;
  title: string;
}

export interface MapBackend {
  listByOwner(ownerId: string): Promise<MapRow[]>;
  getById(id: string): Promise<MapRow | null>;
  insert(ownerId: string, title: string): Promise<MapRow>;
  rename(id: string, title: string): Promise<void>;
  remove(id: string): Promise<void>;
}

export function createMapsRepo(backend: MapBackend) {
  return {
    list: (ownerId: string) => backend.listByOwner(ownerId),
    create: (ownerId: string, title?: string) => backend.insert(ownerId, title?.trim() || '無題のマップ'),
    async get(ownerId: string, id: string): Promise<MapRow> {
      return assertOwner(await backend.getById(id), ownerId);
    },
    async rename(ownerId: string, id: string, title: string): Promise<void> {
      assertOwner(await backend.getById(id), ownerId);
      await backend.rename(id, title);
    },
    async remove(ownerId: string, id: string): Promise<void> {
      assertOwner(await backend.getById(id), ownerId);
      await backend.remove(id);
    },
  };
}

export { OwnerScopeError };
