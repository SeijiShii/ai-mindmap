import type { MindMapNode } from '../../types/domain';

type NodeLite = Pick<MindMapNode, 'id' | 'parentId' | 'text'>;

/**
 * Build a compact context for branch expansion: the target node plus its parent
 * and sibling texts, so the LLM has local structure without the whole tree.
 */
export function buildNodeContext(nodes: NodeLite[], targetId: string): string {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const target = byId.get(targetId);
  if (!target) return '';
  const parent = target.parentId ? byId.get(target.parentId) : undefined;
  const siblings = nodes.filter((n) => n.parentId === target.parentId && n.id !== targetId);
  const childrenTexts = nodes.filter((n) => n.parentId === targetId).map((n) => n.text);

  const parts = [`対象: ${target.text}`];
  if (parent) parts.push(`親: ${parent.text}`);
  if (siblings.length) parts.push(`兄弟: ${siblings.map((s) => s.text).join(' / ')}`);
  if (childrenTexts.length) parts.push(`既存の子: ${childrenTexts.join(' / ')}`);
  return parts.join('\n');
}
