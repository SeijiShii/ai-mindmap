import { and, eq, sql } from 'drizzle-orm';
import type { Db } from '../db/client';
import { maps, nodes, edges, users, usageLog } from '../db/schema';
import { assertOwner } from '../db/with-owner';
import { estimateCost, ratesFromEnv } from '../cost/pricing';
import { checkQuota, consumeQuota, type QuotaStore } from '../cost/quota';
import type { NewNode } from '../features/ai-structuring/merge';
import type { ChatUsage } from '../ai/client';
import type { MapBackend } from '../features/map-management/maps-repo';

/**
 * Real DB-backed implementations of the composition deps (O35). Owner scope is
 * enforced on every query (SEC-001). Wired into the api/ handlers; runs against
 * Neon at deploy time. Quota config tunable (論点-001).
 */
const MONTHLY_FREE_TOKENS = 50000;

function quotaStore(db: Db): QuotaStore {
  return {
    async get(ownerId) {
      const row = (await db.select().from(users).where(eq(users.id, ownerId)).limit(1))[0];
      if (!row) return null;
      return {
        freeTokensRemaining: row.freeTokensRemaining,
        topupTokensRemaining: row.topupTokensRemaining,
        freeTokensResetAt: row.freeTokensResetAt,
      };
    },
    async set(ownerId, s) {
      await db
        .update(users)
        .set({
          freeTokensRemaining: s.freeTokensRemaining,
          topupTokensRemaining: s.topupTokensRemaining,
          freeTokensResetAt: s.freeTokensResetAt,
        })
        .where(eq(users.id, ownerId));
    },
  };
}

export function serverDeps(db: Db, env: Record<string, string | undefined>, now: () => Date) {
  const store = quotaStore(db);
  const cfg = { monthlyFreeTokens: MONTHLY_FREE_TOKENS };
  const rates = ratesFromEnv(env);

  const assertMapOwner = async (mapId: string, ownerId: string) => {
    const row = (await db.select().from(maps).where(eq(maps.id, mapId)).limit(1))[0] ?? null;
    assertOwner(row ? { ownerId: row.ownerId } : null, ownerId); // throws 404 on mismatch
  };

  return {
    async loadNodes(mapId: string, ownerId: string) {
      await assertMapOwner(mapId, ownerId);
      const rows = await db.select().from(nodes).where(eq(nodes.mapId, mapId));
      return rows.map((n) => ({ id: n.id, text: n.text, parentId: n.parentId }));
    },
    async isQuotaBlocked(ownerId: string) {
      const { blocked } = await checkQuota(store, ownerId, now(), cfg);
      return blocked;
    },
    async saveNodes(mapId: string, ownerId: string, newNodes: NewNode[]) {
      await assertMapOwner(mapId, ownerId);
      const tempToId = new Map<string, string>();
      for (const nn of newNodes) {
        const parentId = nn.parentId && tempToId.has(nn.parentId) ? tempToId.get(nn.parentId)! : nn.parentId;
        const inserted = (
          await db
            .insert(nodes)
            .values({ mapId, parentId: parentId ?? null, text: nn.text, source: 'ai', status: 'suggested' })
            .returning({ id: nodes.id })
        )[0];
        tempToId.set(nn.tempId, inserted.id);
        if (parentId) {
          await db.insert(edges).values({ mapId, sourceNodeId: parentId, targetNodeId: inserted.id, kind: nn.kind });
        }
      }
    },
    async recordUsage(ownerId: string, usage: ChatUsage) {
      const cost = estimateCost(usage.inputTokens, usage.outputTokens, rates);
      await db.insert(usageLog).values({
        ownerId,
        endpoint: 'structure',
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        costEstimateUsd: String(cost),
      });
      await consumeQuota(store, ownerId, usage.inputTokens + usage.outputTokens, now(), cfg);
    },
    mapsBackend: {
      async listByOwner(ownerId) {
        return db.select().from(maps).where(eq(maps.ownerId, ownerId)).orderBy(sql`${maps.updatedAt} desc`);
      },
      async getById(id) {
        return (await db.select().from(maps).where(eq(maps.id, id)).limit(1))[0] ?? null;
      },
      async insert(ownerId, title) {
        return (await db.insert(maps).values({ ownerId, title }).returning())[0];
      },
      async rename(id, title) {
        await db.update(maps).set({ title, updatedAt: new Date() }).where(eq(maps.id, id));
      },
      async remove(id) {
        await db.delete(maps).where(and(eq(maps.id, id)));
      },
    } satisfies MapBackend,
  };
}
