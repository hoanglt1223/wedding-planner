CREATE TABLE "wedding_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"uploader_name" text,
	"blob_url" text NOT NULL,
	"thumbnail_url" text,
	"table_group" text,
	"approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wedding_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"assignee_name" text,
	"assignee_token" text,
	"due_date" text,
	"category" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "wedding_tasks_assignee_token_unique" UNIQUE("assignee_token")
);
--> statement-breakpoint
CREATE INDEX "wedding_photos_user_id_idx" ON "wedding_photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wedding_tasks_user_id_idx" ON "wedding_tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wedding_tasks_assignee_token_idx" ON "wedding_tasks" USING btree ("assignee_token");