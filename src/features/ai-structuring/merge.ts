import type { AiNodeSuggestion } from '../../types/ai-contract';
import type { EdgeKind } from '../../types/domain';

/**
 * Core differentiator (論点-002): merge AI suggestions into an existing,
 * human-edited tree. Strictly ADD-ONLY — existing nodes are never modified or
 * deleted, so a person's edits are preserved. Suggestions that duplicate an
 * existing node (by normalized text) are skipped, and additions are capped.
 */

export interface ExistingNode {
  id: string;
  text: string;
}

export interface NewNode {
  tempId: string;
  parentId: string | null;
  text: string;
  kind: EdgeKind;
}

export interface MergePlan {
  newNodes: NewNode[];
}

function normalize(t: string): string {
  return t.trim().toLowerCase().replace(/\s+/g, ' ');
}

const DEFAULT_CAP = 5;

export function mergeSuggestions(
  existing: ExistingNode[],
  suggestions: AiNodeSuggestion[],
  cap = DEFAULT_CAP,
): MergePlan {
  const existingIds = new Set(existing.map((n) => n.id));
  const existingTexts = new Set(existing.map((n) => normalize(n.text)));
  const acceptedTempIds = new Set<string>();
  const newNodes: NewNode[] = [];

  for (const s of suggestions) {
    if (newNodes.length >= cap) break;
    const norm = normalize(s.text);
    if (norm === '' || existingTexts.has(norm)) continue; // dedup / empty

    // resolve parent: an existing node id, or a tempId accepted earlier this batch, else root
    let parentId: string | null = null;
    if (s.parentRef) {
      if (existingIds.has(s.parentRef) || acceptedTempIds.has(s.parentRef)) {
        parentId = s.parentRef;
      }
      // dangling parentRef → attach to root (null) rather than drop
    }

    newNodes.push({ tempId: s.tempId, parentId, text: s.text, kind: s.kind });
    acceptedTempIds.add(s.tempId);
    existingTexts.add(norm); // prevent intra-batch duplicates too
  }

  return { newNodes };
}
