import { requireOwner, AuthError, type SessionVerifier } from "../auth/owner";
import { expandInputSchema } from "../types/api";
import { callExpand, type ChatFn, type ChatUsage } from "../ai/client";
import { buildNodeContext } from "../features/ai-expand/context-builder";
import {
  mergeSuggestions,
  type ExistingNode,
  type NewNode,
} from "../features/ai-structuring/merge";
import { tooManyRequests } from "./rate-limit";

/** Composition of /api/expand (O57): auth → rate-limit → quota → context → AI → add-only suggestions. */
export interface ExpandDeps {
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

export function makeExpandHandler(deps: ExpandDeps) {
  return async (req: Request): Promise<Response> => {
    let ownerId: string;
    try {
      ownerId = await requireOwner(deps.verify, req);
    } catch (e) {
      if (e instanceof AuthError) return json({ error: "unauthorized" }, 401);
      throw e;
    }

    if (await deps.rateLimited(ownerId, req)) return tooManyRequests(); // SEC-004 / O27

    const parsed = expandInputSchema.safeParse(
      await req.json().catch(() => ({})),
    );
    if (!parsed.success) return json({ error: "invalid input" }, 400);
    const { mapId, nodeId, mode } = parsed.data;

    if (await deps.isQuotaBlocked(ownerId))
      return json({ error: "quota_exceeded", upgrade: true }, 402);

    const nodes = await deps.loadNodes(mapId, ownerId);
    const context =
      mode === "gaps"
        ? nodes.map((n) => n.text).join(" / ")
        : buildNodeContext(nodes, nodeId);
    const { result, usage } = await callExpand(deps.chat, context, mode);
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
