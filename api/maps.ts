import { makeMapsHandler } from '../src/app/api-maps';
import { createDb } from '../src/db/client';
import { createClerkVerifier } from '../src/auth/clerk';
import { serverDeps } from '../src/app/server-deps';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const env = process.env;
  const db = createDb(env.DATABASE_URL!);
  const deps = serverDeps(db, env, () => new Date());
  return makeMapsHandler({
    verify: createClerkVerifier(env.CLERK_SECRET_KEY!, env.VITE_CLERK_PUBLISHABLE_KEY!),
    backend: deps.mapsBackend,
  })(req);
}
