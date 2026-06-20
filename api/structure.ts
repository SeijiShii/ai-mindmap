import { makeStructureHandler } from "../src/app/api-structure";
import { createDb } from "../src/db/client";
import { createGuestOrClerkVerifier } from "../src/auth/clerk";
import { createOpenAiChat } from "../src/ai/openai";
import { serverDeps } from "../src/app/server-deps";


export default async function handler(req: Request): Promise<Response> {
  const env = process.env;
  const db = createDb(env.DATABASE_URL!);
  const deps = serverDeps(db, env, () => new Date());
  return makeStructureHandler({
    verify: createGuestOrClerkVerifier(env.GUEST_TOKEN_SECRET!, env.CLERK_SECRET_KEY!, env.VITE_CLERK_PUBLISHABLE_KEY!),
    rateLimited: deps.rateLimited,
    loadNodes: deps.loadNodes,
    isQuotaBlocked: deps.isQuotaBlocked,
    chat: createOpenAiChat(env.OPENAI_API_KEY!),
    saveNodes: deps.saveNodes,
    recordUsage: deps.recordUsage,
  })(req);
}
