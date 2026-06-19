import type { MindMapNode } from '../../types/domain';

/**
 * Summarize an existing tree compactly for the LLM (token saving): an indented
 * outline of node texts instead of full node payloads. Long trees are bounded
 * so the prompt size stays controlled even for large maps.
 */
export function summarizeTree(nodes: Pick<MindMapNode, 'id' | 'parentId' | 'text'>[], maxNodes = 60): string {
  const byParent = new Map<string | null, typeof nodes>();
  for (const n of nodes) {
    const k = n.parentId ?? null;
    const arr = byParent.get(k) ?? [];
    arr.push(n);
    byParent.set(k, arr);
  }
  const lines: string[] = [];
  const walk = (parent: string | null, depth: number) => {
    if (lines.length >= maxNodes) return;
    for (const n of byParent.get(parent) ?? []) {
      if (lines.length >= maxNodes) return;
      lines.push(`${'  '.repeat(depth)}- ${n.text}`);
      walk(n.id, depth + 1);
    }
  };
  walk(null, 0);
  if (nodes.length > maxNodes) lines.push(`  …(他 ${nodes.length - maxNodes} 件)`);
  return lines.join('\n');
}
