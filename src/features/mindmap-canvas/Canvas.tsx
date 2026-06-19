import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { toFlowNodes, toFlowEdges } from './to-flow';
import type { MindMapNode, MindMapEdge } from '../../types/domain';

/**
 * React Flow canvas. Human nodes render solid, AI suggestions dashed (via the
 * node-* / edge-* classes from to-flow; styled by tokens). Editing handlers are
 * passed from the page; this component owns the render.
 */
export function Canvas({ nodes, edges }: { nodes: MindMapNode[]; edges: MindMapEdge[] }) {
  return (
    <div style={{ width: '100%', height: '100%' }} data-testid="mindmap-canvas">
      <ReactFlow nodes={toFlowNodes(nodes)} edges={toFlowEdges(edges)} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
