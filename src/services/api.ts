/**
 * Frontend → backend service layer (the wiring that connects the UI to the edge
 * functions). Every call attaches a Bearer token from the injected getToken
 * (Clerk session or §1.7 guest JWT). Pure-ish + injectable so it unit-tests with
 * a mock fetch.
 */
export interface MapMetaView {
  id: string;
  title: string;
}
export interface NodeView {
  id: string;
  text: string;
  parentId: string | null;
  posX: number;
  posY: number;
  source: "ai" | "human";
  status: "confirmed" | "suggested";
}
export interface EdgeView {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  kind: string;
}
export interface MapDetailView {
  nodes: NodeView[];
  edges: EdgeView[];
}

export type GetToken = () => Promise<string | null>;
type FetchLike = (path: string, init?: RequestInit) => Promise<Response>;

export function createApi(getToken: GetToken, fetchImpl: FetchLike = fetch) {
  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getToken();
    const headers = new Headers(init.headers);
    headers.set("content-type", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);
    const res = await fetchImpl(path, { ...init, headers });
    if (!res.ok) {
      const err = new Error(`${path} → ${res.status}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    return res.json() as Promise<T>;
  }

  return {
    listMaps: () => call<{ maps: MapMetaView[] }>("/api/maps"),
    createMap: (title?: string) =>
      call<{ map: MapMetaView }>("/api/maps", {
        method: "POST",
        body: JSON.stringify({ title }),
      }),
    loadMap: (mapId: string) =>
      call<MapDetailView>(`/api/maps?id=${encodeURIComponent(mapId)}`),
    structure: (mapId: string, transcriptDelta: string) =>
      call<{ added: number }>("/api/structure", {
        method: "POST",
        body: JSON.stringify({ mapId, transcriptDelta }),
      }),
    expand: (
      mapId: string,
      nodeId: string,
      mode: "branch" | "gaps" = "branch",
    ) =>
      call<{ added: number }>("/api/expand", {
        method: "POST",
        body: JSON.stringify({ mapId, nodeId, mode }),
      }),
  };
}

export type Api = ReturnType<typeof createApi>;
