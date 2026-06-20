import { defineConfig } from "drizzle-kit";

/**
 * Drizzle migration config (concept §4.5.4 `npm run db:migrate`). `generate`
 * diffs the schema → SQL (no DB needed, Class A); `migrate` applies to Neon at
 * release with DATABASE_URL (Class B).
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
