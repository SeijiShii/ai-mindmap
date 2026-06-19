import { z } from 'zod';

/**
 * AI structured-output contract (SEC-002): the LLM is constrained to emit JSON
 * matching these schemas. Output is Zod-parsed at the trust boundary so a
 * prompt-injected response that ignores the format is rejected, not executed.
 */

export const edgeKindSchema = z.enum([
  'tree',
  'relation',
  'opposition',
  'question',
  'example',
]);

export const aiNodeSuggestionSchema = z.object({
  /** Temp id used to wire edges within one response. */
  tempId: z.string().min(1),
  /** Reference to an existing node id or another suggestion's tempId; null = root. */
  parentRef: z.string().nullable(),
  text: z.string().min(1).max(2000),
  kind: edgeKindSchema,
});
export type AiNodeSuggestion = z.infer<typeof aiNodeSuggestionSchema>;

/** Incremental-merge result (ai-structuring). */
export const structureResultSchema = z.object({
  suggestions: z.array(aiNodeSuggestionSchema).max(20),
});
export type StructureResult = z.infer<typeof structureResultSchema>;

/** Branch-expansion result (ai-expand). */
export const expandResultSchema = z.object({
  suggestions: z.array(aiNodeSuggestionSchema).max(20),
});
export type ExpandResult = z.infer<typeof expandResultSchema>;
