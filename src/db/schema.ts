import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  uuid,
  real,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey(),
  weddingData: jsonb("wedding_data"),
  groomName: text("groom_name"),
  brideName: text("bride_name"),
  groomBirthDate: text("groom_birth_date"),
  brideBirthDate: text("bride_birth_date"),
  weddingDate: text("wedding_date"),
  engagementDate: text("engagement_date"),
  partyTime: text("party_time"),
  region: text("region"),
  lang: text("lang"),
  guestCount: integer("guest_count").default(0),
  vendorCount: integer("vendor_count").default(0),
  photoCount: integer("photo_count").default(0),
  checklistProgress: real("checklist_progress").default(0),
  budget: integer("budget").default(0),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id"),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const rsvpInvitations = pgTable("rsvp_invitations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  guestName: text("guest_name").notNull(),
  token: text("token").notNull().unique(),
  status: text("status").notNull().default("pending"),
  plusOnes: integer("plus_ones").notNull().default(0),
  dietary: text("dietary"),
  message: text("message"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("rsvp_invitations_user_id_idx").on(table.userId),
]);
