import { describe, it, expect, vi } from "vitest";
import { createApi } from "./api";

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("createApi (frontend↔backend wiring)", () => {
  it("attaches the Bearer token from getToken", async () => {
    const fetchMock = vi.fn(async (_path: string, _init?: RequestInit) => jsonRes({ maps: [] }));
    const api = createApi(async () => "guest.jwt", fetchMock);
    await api.listMaps();
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = new Headers((init as RequestInit).headers);
    expect(headers.get("authorization")).toBe("Bearer guest.jwt");
  });

  it("createMap POSTs the title and returns the map", async () => {
    const fetchMock = vi.fn(async (_path: string, _init?: RequestInit) => jsonRes({ map: { id: "m1", title: "X" } }));
    const api = createApi(async () => "t", fetchMock);
    const { map } = await api.createMap("X");
    expect(map.id).toBe("m1");
    const [path, init] = fetchMock.mock.calls[0]!;
    expect(path).toBe("/api/maps");
    expect((init as RequestInit).method).toBe("POST");
  });

  it("loadMap fetches by id and returns nodes+edges", async () => {
    const fetchMock = vi.fn(async (_path: string, _init?: RequestInit) => jsonRes({ nodes: [{ id: "n1" }], edges: [] }));
    const api = createApi(async () => "t", fetchMock);
    const detail = await api.loadMap("m1");
    expect(fetchMock.mock.calls[0]![0]).toBe("/api/maps?id=m1");
    expect(detail.nodes).toHaveLength(1);
  });

  it("structure posts mapId+delta", async () => {
    const fetchMock = vi.fn(async (_path: string, _init?: RequestInit) => jsonRes({ added: 2 }));
    const api = createApi(async () => "t", fetchMock);
    const r = await api.structure("m1", "会議の要点");
    expect(r.added).toBe(2);
    expect(fetchMock.mock.calls[0]![0]).toBe("/api/structure");
  });

  it("throws with status on non-ok", async () => {
    const fetchMock = vi.fn(async (_path: string, _init?: RequestInit) => jsonRes({ error: "unauthorized" }, 401));
    const api = createApi(async () => null, fetchMock);
    await expect(api.listMaps()).rejects.toMatchObject({ status: 401 });
  });
});
