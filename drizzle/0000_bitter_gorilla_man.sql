CREATE TABLE "admin_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"event_type" text NOT NULL,
	"event_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"wedding_data" jsonb,
	"groom_name" text,
	"bride_name" text,
	"groom_birth_date" text,
	"bride_birth_date" text,
	"wedding_date" text,
	"region" text,
	"lang" text,
	"guest_count" integer DEFAULT 0,
	"checklist_progress" real DEFAULT 0,
	"budget" integer DEFAULT 0,
	"onboarding_complete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_user_sessions_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_sessions"("id") ON DELETE no action ON UPDATE no action;