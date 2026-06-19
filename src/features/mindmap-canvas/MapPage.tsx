import { useState } from 'react';
import { Canvas } from './Canvas';
import { CapturePanel } from '../live-capture/CapturePanel';
import type { MindMapNode, MindMapEdge } from '../../types/domain';

/**
 * The core experience screen: a growing canvas (top) + capture input (bottom).
 * Sending text marks the panel busy while the tree grows. Data fetching/sending
 * is injected by the route (onSend) so this composes cleanly and tests headless.
 */
export function MapPage({
  nodes,
  edges,
  onSend,
}: {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onSend: (text: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const send = async (text: string) => {
    setBusy(true);
    try {
      await onSend(text);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      <div className="flex-1">
        <Canvas nodes={nodes} edges={edges} />
      </div>
      <CapturePanel onSend={send} busy={busy} />
    </div>
  );
}
