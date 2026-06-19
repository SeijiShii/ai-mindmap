import { requireOwner, AuthError, type SessionVerifier } from '../auth/owner';
import { createMapInputSchema } from '../types/api';
import { createMapsRepo, OwnerScopeError, type MapBackend } from '../features/map-management/maps-repo';

/**
 * Composition of /api/maps (O57): auth → owner-scoped repo. GET lists the
 * owner's maps; POST creates one. OwnerScopeError → 404 (no leakage, SEC-001).
 * Backend injected for testability.
 */
export interface MapsDeps {
  verify: SessionVerifier;
  backend: MapBackend;
}

export function makeMapsHandler(deps: MapsDeps) {
  const repo = createMapsRepo(deps.backend);
  return async (req: Request): Promise<Response> => {
    let ownerId: string;
    try {
      ownerId = await requireOwner(deps.verify, req);
    } catch (e) {
      if (e instanceof AuthError) return json({ error: 'unauthorized' }, 401);
      throw e;
    }
    try {
      if (req.method === 'GET') {
        return json({ maps: await repo.list(ownerId) }, 200);
      }
      if (req.method === 'POST') {
        const parsed = createMapInputSchema.safeParse(await req.json().catch(() => ({})));
        if (!parsed.success) return json({ error: 'invalid input' }, 400);
        return json({ map: await repo.create(ownerId, parsed.data.title) }, 201);
      }
      return json({ error: 'method not allowed' }, 405);
    } catch (e) {
      if (e instanceof OwnerScopeError) return json({ error: 'not found' }, 404);
      throw e;
    }
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
