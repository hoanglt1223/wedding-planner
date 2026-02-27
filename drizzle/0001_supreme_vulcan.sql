ALTER TABLE "user_sessions" ADD COLUMN "engagement_date" text;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "party_time" text;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "vendor_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "photo_count" integer DEFAULT 0;