import { and, eq, type SQL } from 'drizzle-orm';
import { maps, usageLog } from './schema';

/**
 * SEC-001 owner-scope enforcement primitives.
 *
 * Neon + serverless functions connect with a single DB role, so Postgres RLS
 * (auth.uid()) is not effective. Instead every owner-scoped query MUST go
 * through these helpers, which force an `owner_id = :ctxOwner` predicate and
 * reject access to rows owned by someone else. `ctxOwner` is supplied by
 * _shared/auth from the verified Clerk session.
 */

export class OwnerScopeError extends Error {
  /** HTTP-ish status the API layer maps to (404 to avoid leaking existence). */
  readonly status: number;
  constructor(message = 'owner scope violation') {
    super(message);
    this.name = 'OwnerScopeError';
    this.status = 404;
  }
}

/** Guard a context ownerId: must be a non-empty string. */
export function ensureOwnerId(ownerId: unknown): string {
  if (typeof ownerId !== 'string' || ownerId.trim() === '') {
    throw new OwnerScopeError('missing owner context');
  }
  return ownerId;
}

/** Build a WHERE predicate scoped to the owner for an owner-bearing table. */
export function ownerScope(
  table: typeof maps | typeof usageLog,
  ownerId: string,
  extra?: SQL,
): SQL {
  const oid = ensureOwnerId(ownerId);
  const base = eq(table.ownerId, oid);
  return extra ? (and(base, extra) as SQL) : base;
}

/**
 * Assert a loaded row belongs to ctxOwner. Throws OwnerScopeError (→ 404) when
 * the row is missing or owned by someone else. Use after fetching a row by id.
 */
export function assertOwner<T extends { ownerId: string }>(
  row: T | null | undefined,
  ownerId: string,
): T {
  const oid = ensureOwnerId(ownerId);
  if (!row || row.ownerId !== oid) {
    throw new OwnerScopeError();
  }
  return row;
}
