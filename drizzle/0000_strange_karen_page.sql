CREATE TYPE "public"."ai_endpoint" AS ENUM('structure', 'expand');--> statement-breakpoint
CREATE TYPE "public"."edge_kind" AS ENUM('tree', 'relation', 'opposition', 'question', 'example');--> statement-breakpoint
CREATE TYPE "public"."node_source" AS ENUM('ai', 'human');--> statement-breakpoint
CREATE TYPE "public"."node_status" AS ENUM('confirmed', 'suggested');--> statement-breakpoint
CREATE TABLE "edges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"source_node_id" uuid NOT NULL,
	"target_node_id" uuid NOT NULL,
	"kind" "edge_kind" DEFAULT 'tree' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text DEFAULT '無題のマップ' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"parent_id" uuid,
	"text" text NOT NULL,
	"pos_x" real DEFAULT 0 NOT NULL,
	"pos_y" real DEFAULT 0 NOT NULL,
	"source" "node_source" NOT NULL,
	"status" "node_status" DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "processed_events" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"endpoint" "ai_endpoint" NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"cost_estimate_usd" numeric(10, 6) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"is_guest" boolean DEFAULT true NOT NULL,
	"free_tokens_remaining" integer DEFAULT 0 NOT NULL,
	"free_tokens_reset_at" timestamp with time zone DEFAULT now() NOT NULL,
	"topup_tokens_remaining" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_source_node_id_nodes_id_fk" FOREIGN KEY ("source_node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_target_node_id_nodes_id_fk" FOREIGN KEY ("target_node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maps" ADD CONSTRAINT "maps_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_log" ADD CONSTRAINT "usage_log_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "edges_map_idx" ON "edges" USING btree ("map_id");--> statement-breakpoint
CREATE INDEX "maps_owner_idx" ON "maps" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "nodes_map_idx" ON "nodes" USING btree ("map_id");--> statement-breakpoint
CREATE INDEX "usage_log_owner_created_idx" ON "usage_log" USING btree ("owner_id","created_at");