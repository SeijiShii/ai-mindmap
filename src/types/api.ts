import { z } from 'zod';

/** API input schemas (SEC-002): every endpoint validates input at the boundary. */

export const createMapInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});
export type CreateMapInput = z.infer<typeof createMapInputSchema>;

export const updateNodeInputSchema = z.object({
  id: z.string().uuid(),
  text: z.string().max(5000).optional(),
  posX: z.number().finite().optional(),
  posY: z.number().finite().optional(),
  status: z.enum(['confirmed', 'suggested']).optional(),
});
export type UpdateNodeInput = z.infer<typeof updateNodeInputSchema>;

export const structureInputSchema = z.object({
  mapId: z.string().uuid(),
  /** Transcript delta after PII scrub; empty string is a no-op. */
  transcriptDelta: z.string().max(8000),
});
export type StructureInput = z.infer<typeof structureInputSchema>;

export const expandInputSchema = z.object({
  mapId: z.string().uuid(),
  nodeId: z.string().uuid(),
  mode: z.enum(['branch', 'gaps']).default('branch'),
});
export type ExpandInput = z.infer<typeof expandInputSchema>;
