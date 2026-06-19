import type { MindMapNode } from '../../types/domain';

type NodeLite = Pick<MindMapNode, 'id' | 'parentId' | 'text'>;

/**
 * SEC-002 formula/CSV injection guard: cells starting with = + - @ are prefixed
 * so spreadsheet apps don't execute them. Applied to any delimited export.
 */
export function escapeFormula(text: string): string {
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function children(nodes: NodeLite[]): Map<string | null, NodeLite[]> {
  const m = new Map<string | null, NodeLite[]>();
  for (const n of nodes) {
    const k = n.parentId ?? null;
    const a = m.get(k) ?? [];
    a.push(n);
    m.set(k, a);
  }
  return m;
}

/** Nested Markdown bullet list. */
export function toMarkdown(nodes: NodeLite[]): string {
  const byParent = children(nodes);
  const lines: string[] = [];
  const walk = (parent: string | null, depth: number) => {
    for (const n of byParent.get(parent) ?? []) {
      lines.push(`${'  '.repeat(depth)}- ${n.text.replace(/\r?\n/g, ' ')}`);
      walk(n.id, depth + 1);
    }
  };
  walk(null, 0);
  return lines.join('\n');
}

/** Indented plain-text outline (tabs). */
export function toOutline(nodes: NodeLite[]): string {
  const byParent = children(nodes);
  const lines: string[] = [];
  const walk = (parent: string | null, depth: number) => {
    for (const n of byParent.get(parent) ?? []) {
      lines.push(`${'\t'.repeat(depth)}${escapeFormula(n.text.replace(/\r?\n/g, ' '))}`);
      walk(n.id, depth + 1);
    }
  };
  walk(null, 0);
  return lines.join('\n');
}
