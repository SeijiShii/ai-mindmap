import {
  pgTable,
  text,
  uuid,
  integer,
  real,
  boolean,
  timestamp,
  numeric,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// --- enums (SPEC §3) ---
export const nodeSourceEnum = pgEnum("node_source", ["ai", "human"]);
export const nodeStatusEnum = pgEnum("node_status", ["confirmed", "suggested"]);
export const edgeKindEnum = pgEnum("edge_kind", [
  "tree",
  "relation",
  "opposition",
  "question",
  "example",
]);
export const aiEndpointEnum = pgEnum("ai_endpoint", ["structure", "expand"]);

// --- users ---
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user_id (anonymous guest keeps same id after linking)
  isGuest: boolean("is_guest").notNull().default(true),
  freeTokensRemaining: integer("free_tokens_remaining").notNull().default(0),
  freeTokensResetAt: timestamp("free_tokens_reset_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  topupTokensRemaining: integer("topup_tokens_remaining").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- maps ---
export const maps = pgTable(
  "maps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("無題のマップ"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({ ownerIdx: index("maps_owner_idx").on(t.ownerId) }),
);

// --- nodes ---
export const nodes = pgTable(
  "nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mapId: uuid("map_id")
      .notNull()
      .references(() => maps.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    text: text("text").notNull(),
    posX: real("pos_x").notNull().default(0),
    posY: real("pos_y").notNull().default(0),
    source: nodeSourceEnum("source").notNull(),
    status: nodeStatusEnum("status").notNull().default("confirmed"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({ mapIdx: index("nodes_map_idx").on(t.mapId) }),
);

// --- edges ---
export const edges = pgTable(
  "edges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mapId: uuid("map_id")
      .notNull()
      .references(() => maps.id, { onDelete: "cascade" }),
    sourceNodeId: uuid("source_node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    targetNodeId: uuid("target_node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    kind: edgeKindEnum("kind").notNull().default("tree"),
  },
  (t) => ({ mapIdx: index("edges_map_idx").on(t.mapId) }),
);

// --- usage_log (§4.6.2 cost tracking) ---
export const usageLog = pgTable(
  "usage_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    endpoint: aiEndpointEnum("endpoint").notNull(),
    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    costEstimateUsd: numeric("cost_estimate_usd", { precision: 10, scale: 6 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    ownerCreatedIdx: index("usage_log_owner_created_idx").on(
      t.ownerId,
      t.createdAt,
    ),
  }),
);

// --- processed_events (billing webhook idempotency, billing SPEC §4 二重補充防止) ---
export const processedEvents = pgTable("processed_events", {
  id: text("id").primaryKey(), // Stripe event id
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const schema = { users, maps, nodes, edges, usageLog, processedEvents };
