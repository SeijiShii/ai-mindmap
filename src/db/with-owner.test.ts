import { describe, it, expect } from 'vitest';
import { ensureOwnerId, ownerScope, assertOwner, OwnerScopeError } from './with-owner';
import { maps, usageLog } from './schema';

describe('with-owner (SEC-001 owner enforcement)', () => {
  describe('ensureOwnerId', () => {
    it('returns a valid ownerId (N6)', () => {
      expect(ensureOwnerId('user_123')).toBe('user_123');
    });
    it('throws on empty/missing owner context (E4: owner-less query forbidden)', () => {
      expect(() => ensureOwnerId('')).toThrow(OwnerScopeError);
      expect(() => ensureOwnerId('   ')).toThrow(OwnerScopeError);
      expect(() => ensureOwnerId(undefined)).toThrow(OwnerScopeError);
      expect(() => ensureOwnerId(null)).toThrow(OwnerScopeError);
    });
  });

  describe('ownerScope', () => {
    it('builds a predicate for maps when ownerId present (N6)', () => {
      const sql = ownerScope(maps, 'user_123');
      expect(sql).toBeTruthy();
    });
    it('builds a predicate for usageLog (N7)', () => {
      expect(ownerScope(usageLog, 'user_123')).toBeTruthy();
    });
    it('refuses to build a scope without an owner (E4)', () => {
      expect(() => ownerScope(maps, '')).toThrow(OwnerScopeError);
    });
  });

  describe('assertOwner', () => {
    it('returns the row when owner matches (N6)', () => {
      const row = { ownerId: 'user_123', title: 'x' };
      expect(assertOwner(row, 'user_123')).toBe(row);
    });
    it("throws 404-equivalent for another user's row (E1: no leakage)", () => {
      const row = { ownerId: 'user_999', title: 'secret' };
      try {
        assertOwner(row, 'user_123');
        throw new Error('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(OwnerScopeError);
        expect((e as OwnerScopeError).status).toBe(404);
      }
    });
    it('throws for a missing row (E1)', () => {
      expect(() => assertOwner(null, 'user_123')).toThrow(OwnerScopeError);
      expect(() => assertOwner(undefined, 'user_123')).toThrow(OwnerScopeError);
    });
    it('throws when ctxOwner is empty even if row exists (E4)', () => {
      expect(() => assertOwner({ ownerId: 'user_123' }, '')).toThrow(OwnerScopeError);
    });
  });
});
