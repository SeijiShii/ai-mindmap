import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { schema } from './schema';

/**
 * Create a Drizzle client over Neon's serverless HTTP driver.
 * Connection string is injected (never read from a hardcoded global) so this
 * module stays env-agnostic and testable. API routes pass `process.env.DATABASE_URL`.
 */
export function createDb(connectionString: string) {
  return drizzle(neon(connectionString), { schema });
}

export type Db = ReturnType<typeof createDb>;
