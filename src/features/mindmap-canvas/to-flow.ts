import type { MindMapNode, MindMapEdge } from '../../types/domain';

/**
 * Map domain nodes/edges to React Flow shapes, encoding the human/AI visual
 * distinction (design-system §2): human = solid, AI suggestion = dashed teal.
 * Pure + testable; the Canvas component renders the result.
 */
export interface FlowNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
  className: string;
}
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  className: string;
}

export function nodeClass(n: Pick<MindMapNode, 'source' | 'status'>): string {
  if (n.source === 'ai' && n.status === 'suggested') return 'node-ai-suggested';
  return 'node-human';
}

export function toFlowNodes(nodes: MindMapNode[]): FlowNode[] {
  return nodes.map((n) => ({
    id: n.id,
    position: { x: n.posX, y: n.posY },
    data: { label: n.text },
    className: nodeClass(n),
  }));
}

export function toFlowEdges(edges: MindMapEdge[]): FlowEdge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.sourceNodeId,
    target: e.targetNodeId,
    className: `edge-${e.kind}`,
  }));
}
