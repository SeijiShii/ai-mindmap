import { requireOwner, AuthError, type SessionVerifier } from "../auth/owner";
import { structureInputSchema } from "../types/api";
import { callStructure, type ChatFn, type ChatUsage } from "../ai/client";
import { summarizeTree } from "../features/ai-structuring/tree-summary";
import { tooManyRequests } from "./rate-limit";
import {
  mergeSuggestions,
  type ExistingNode,
  type NewNode,
} from "../features/ai-structuring/merge";

/**
 * Composition of the /api/structure route (O57 app-shell wiring): auth → quota →
 * owner-scoped load → AI → add-only merge → persist → usage. Deps are injected
 * so the full integration is testable without Clerk/OpenAI/DB (P4.46 401 + SEC-004).
 */
export interface StructureDeps {
  verify: SessionVerifier;
  rateLimited: (ownerId: string, req: Request) => Promise<boolean>;
  loadNodes: (
    mapId: string,
    ownerId: string,
  ) => Promise<(ExistingNode & { parentId: string | null })[]>;
  isQuotaBlocked: (ownerId: string) => Promise<boolean>;
  chat: ChatFn;
  saveNodes: (
    mapId: string,
    ownerId: string,
    nodes: NewNode[],
  ) => Promise<void>;
  recordUsage: (ownerId: string, usage: ChatUsage) => Promise<void>;
}

export function makeStructureHandler(deps: StructureDeps) {
  return async (req: Request): Promise<Response> => {
    let ownerId: string;
    try {
      ownerId = await requireOwner(deps.verify, req);
    } catch (e) {
      if (e instanceof AuthError) return json({ error: "unauthorized" }, 401);
      throw e;
    }

    if (await deps.rateLimited(ownerId, req)) return tooManyRequests(); // SEC-004 / O27

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ error: "invalid body" }, 400);
    }
    const parsed = structureInputSchema.safeParse(body);
    if (!parsed.success) return json({ error: "invalid input" }, 400);
    const { mapId, transcriptDelta } = parsed.data;

    if (await deps.isQuotaBlocked(ownerId)) {
      return json({ error: "quota_exceeded", upgrade: true }, 402);
    }

    const nodes = await deps.loadNodes(mapId, ownerId); // owner-scoped (SEC-001)
    const summary = summarizeTree(nodes);
    const { result, usage } = await callStructure(
      deps.chat,
      summary,
      transcriptDelta,
    );
    const { newNodes } = mergeSuggestions(nodes, result.suggestions);

    if (newNodes.length) await deps.saveNodes(mapId, ownerId, newNodes);
    await deps.recordUsage(ownerId, usage);

    return json({ added: newNodes.length, nodes: newNodes }, 200);
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
