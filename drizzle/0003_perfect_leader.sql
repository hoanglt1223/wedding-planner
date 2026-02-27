CREATE TABLE "rsvp_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"guest_name" text NOT NULL,
	"token" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"plus_ones" integer DEFAULT 0 NOT NULL,
	"dietary" text,
	"message" text,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rsvp_invitations_token_unique" UNIQUE("token")
);
