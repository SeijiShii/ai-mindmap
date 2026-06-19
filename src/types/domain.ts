import type { users, maps, nodes, edges, usageLog } from '../db/schema';

// DB-derived row types (single source = _shared/db, no re-definition)
export type User = typeof users.$inferSelect;
export type MapMeta = typeof maps.$inferSelect;
export type MindMapNode = typeof nodes.$inferSelect;
export type MindMapEdge = typeof edges.$inferSelect;
export type UsageLogRow = typeof usageLog.$inferSelect;

// Enum unions (kept in sync with schema pgEnums)
export type NodeSource = 'ai' | 'human';
export type NodeStatus = 'confirmed' | 'suggested';
export type EdgeKind = 'tree' | 'relation' | 'opposition' | 'question' | 'example';
export type AiEndpoint = 'structure' | 'expand';

export const EDGE_KINDS: readonly EdgeKind[] = [
  'tree',
  'relation',
  'opposition',
  'question',
  'example',
] as const;

/** Full graph payload returned to the canvas. */
export interface MapGraph {
  meta: MapMeta;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}
