import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthToken } from "../../auth/useAuthToken";
import { createApi, type NodeView, type EdgeView } from "../../services/api";
import { MapPage } from "./MapPage";
import type { MindMapNode, MindMapEdge, EdgeKind } from "../../types/domain";

/**
 * The wiring that connects the canvas screen to the backend (the core loop that
 * was previously stubbed): ensure the guest's default map → load its nodes/edges
 * → capture text → POST /api/structure → refetch. Auth (guest JWT or Clerk) is
 * attached by useAuthToken via the api layer.
 */
function toNode(n: NodeView): MindMapNode {
  return {
    id: n.id,
    mapId: "",
    parentId: n.parentId,
    text: n.text,
    posX: n.posX,
    posY: n.posY,
    source: n.source,
    status: n.status,
    createdAt: new Date(),
  };
}
function toEdge(e: EdgeView): MindMapEdge {
  return {
    id: e.id,
    mapId: "",
    sourceNodeId: e.sourceNodeId,
    targetNodeId: e.targetNodeId,
    kind: e.kind as EdgeKind,
  };
}

export function MapWorkspace() {
  const getToken = useAuthToken();
  const api = useMemo(() => createApi(getToken), [getToken]);
  const qc = useQueryClient();

  const mapQuery = useQuery({
    queryKey: ["default-map"],
    queryFn: async () => {
      const { maps } = await api.listMaps();
      if (maps.length) return maps[0]!;
      const { map } = await api.createMap("はじめてのマップ");
      return map;
    },
  });
  const mapId = mapQuery.data?.id;

  const detailQuery = useQuery({
    queryKey: ["map-detail", mapId],
    enabled: !!mapId,
    queryFn: () => api.loadMap(mapId!),
  });

  const structureMut = useMutation({
    mutationFn: (text: string) => api.structure(mapId!, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["map-detail", mapId] }),
  });

  if (mapQuery.isLoading || !mapId)
    return <main className="p-4 text-text-muted">準備しています…</main>;
  if (mapQuery.isError)
    return (
      <main className="p-4 text-danger" role="alert">
        うまく読み込めませんでした。少し待ってから開き直してください。
      </main>
    );

  const nodes = (detailQuery.data?.nodes ?? []).map(toNode);
  const edges = (detailQuery.data?.edges ?? []).map(toEdge);

  return (
    <MapPage
      nodes={nodes}
      edges={edges}
      onSend={async (t) => {
        await structureMut.mutateAsync(t);
      }}
    />
  );
}
