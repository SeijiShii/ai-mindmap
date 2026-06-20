import { createGuestSession } from '../../src/auth/clerk';
import { createDb } from '../../src/db/client';
import { ensureUser } from '../../src/auth/ensure-user';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';


/**
 * P4.46 production guest path: create an anonymous Clerk user + ensure a DB row,
 * return a sign-in ticket the frontend completes. (Runs with real Clerk/Neon.)
 */
export default async function handler(): Promise<Response> {
  const env = process.env;
  const { userId, ticket } = await createGuestSession(env.CLERK_SECRET_KEY!);
  const db = createDb(env.DATABASE_URL!);
  await ensureUser(
    {
      async find(id) {
        const r = (await db.select().from(users).where(eq(users.id, id)).limit(1))[0];
        return r ? { id: r.id, isGuest: r.isGuest } : null;
      },
      async insert(rec) {
        await db.insert(users).values({ id: rec.id, isGuest: rec.isGuest });
      },
      async setGuest(id, isGuest) {
        await db.update(users).set({ isGuest }).where(eq(users.id, id));
      },
    },
    userId,
  );
  return new Response(JSON.stringify({ ticket }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
