# Phase 1: Database Schema + State Migration

## Context Links

- [Brainstorm Report](./reports/brainstorm-report.md)
- [Existing schema](../../src/db/schema.ts)
- [Existing state type](../../src/types/wedding.ts)
- [Migration logic](../../src/lib/migrate-state.ts)
- [Default state](../../src/data/backgrounds.ts)
- [Store hook](../../src/hooks/use-wedding-store.ts)

## Overview

- **Priority:** P1 (blocks all other phases)
- **Status:** complete
- **Description:** Add `rsvp_invitations` table to Drizzle schema, generate migration, extend WeddingState with `rsvpSettings` + Guest `rsvpToken`, bump storage key to wp_v14.

## Key Insights

- Existing schema pattern uses `pgTable` from `drizzle-orm/pg-core` with explicit column types
- State migration chain: v7 -> v8 -> v9 -> v10 -> v11 -> v12 -> v13. Next is v13 -> v14
- `migrateState()` runs once on module load in `use-wedding-store.ts`
- DEFAULT_STATE lives in `src/data/backgrounds.ts` and must be updated
- Guest type currently: `{ name, phone, side, tableGroup, id }` -- add optional `rsvpToken`

## Requirements

### Functional
- New `rsvp_invitations` PostgreSQL table with columns per brainstorm spec
- WeddingState gains `rsvpSettings` object for planner customization
- Guest type gains optional `rsvpToken` field for local linking
- Seamless v13 -> v14 migration (existing users keep all data)

### Non-functional
- No breaking changes to existing sync endpoint
- Schema must be compatible with Drizzle Kit migration generation

## Architecture

### New Table: `rsvp_invitations`

```typescript
export const rsvpInvitations = pgTable("rsvp_invitations", {
  id:          serial("id").primaryKey(),
  userId:      text("user_id").notNull(),          // planner's anonymous UUID
  guestName:   text("guest_name").notNull(),        // guest name from list
  token:       text("token").notNull().unique(),     // 12-char nanoid
  status:      text("status").notNull().default("pending"), // pending|accepted|declined
  plusOnes:    integer("plus_ones").notNull().default(0),
  dietary:     text("dietary"),
  message:     text("message"),
  respondedAt: timestamp("responded_at"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});
```

Index on `token` (unique constraint provides this). Index on `userId` for dashboard queries.

### New Types

```typescript
// In src/types/wedding.ts
export interface RsvpSettings {
  welcomeMessage: string;
  venue: string;
  venueAddress: string;
  venueMapLink: string;
  coupleStory: string;
}

// Update Guest interface
export interface Guest {
  name: string;
  phone: string;
  side: string;
  tableGroup: string;
  id: number;
  rsvpToken?: string;  // NEW: linked token after bulk generation
}

// Update WeddingState
export interface WeddingState {
  // ... existing fields ...
  rsvpSettings: RsvpSettings;  // NEW
}
```

### Default RsvpSettings

```typescript
rsvpSettings: {
  welcomeMessage: "",
  venue: "",
  venueAddress: "",
  venueMapLink: "",
  coupleStory: "",
}
```

### Migration: v13 -> v14

In `src/lib/migrate-state.ts`, add V14_KEY constant and migration block:
- Read `wp_v13`, add `rsvpSettings` with empty defaults
- Existing guests keep their shape; `rsvpToken` is optional so no transform needed
- Write to `wp_v14`
- Update early-return check at top of `migrateState()` to check V14_KEY

### Store Key Bump

In `use-wedding-store.ts`: change `STORAGE_KEY` from `"wp_v13"` to `"wp_v14"`.

## Related Code Files

### Files to Modify
- `src/db/schema.ts` — add `rsvpInvitations` table definition
- `src/types/wedding.ts` — add `RsvpSettings` interface, update `Guest` and `WeddingState`
- `src/lib/migrate-state.ts` — add V14_KEY, v13->v14 migration block, update guard
- `src/data/backgrounds.ts` — add `rsvpSettings` defaults to `DEFAULT_STATE`
- `src/hooks/use-wedding-store.ts` — change STORAGE_KEY to `"wp_v14"`, add `setRsvpSettings` callback
- `api/sync.ts` — no changes needed (rsvpSettings synced as part of wedding_data JSONB)

### Files to Create
- None (schema change is in existing file)

## Implementation Steps

1. **Add RsvpSettings type** to `src/types/wedding.ts`
   - Add `RsvpSettings` interface
   - Add `rsvpToken?: string` to `Guest` interface
   - Add `rsvpSettings: RsvpSettings` to `WeddingState` interface

2. **Add rsvpInvitations table** to `src/db/schema.ts`
   - Import `serial, text, integer, timestamp` (already imported)
   - Add `rsvpInvitations` table definition after existing tables
   - Add index on `userId` column using `.index()` or separate index definition

3. **Update DEFAULT_STATE** in `src/data/backgrounds.ts`
   - Add `rsvpSettings` with empty string defaults

4. **Add migration v13->v14** in `src/lib/migrate-state.ts`
   - Add `const V14_KEY = "wp_v14";`
   - Update the early-return guard: `if (localStorage.getItem(V14_KEY)) return;`
   - Add v13->v14 block before the existing v12->v13 block:
     - Read V13_KEY, add `rsvpSettings` defaults, write V14_KEY

5. **Bump store key** in `src/hooks/use-wedding-store.ts`
   - Change `STORAGE_KEY` from `"wp_v13"` to `"wp_v14"`

6. **Add setRsvpSettings callback** to `use-wedding-store.ts`
   - Pattern matches existing `updateInfo` callback

7. **Generate Drizzle migration**
   - Run `npm run db:generate` to create migration SQL file
   - Run `npm run db:migrate` to apply to Neon

8. **Build check**: `npm run build` to verify no TS errors

## Todo List

- [ ] Add RsvpSettings interface to wedding.ts
- [ ] Add rsvpToken to Guest interface
- [ ] Add rsvpSettings to WeddingState interface
- [ ] Add rsvpInvitations table to schema.ts
- [ ] Update DEFAULT_STATE with rsvpSettings defaults
- [ ] Add V14_KEY and migration block in migrate-state.ts
- [ ] Bump STORAGE_KEY to wp_v14 in use-wedding-store.ts
- [ ] Add setRsvpSettings callback to store
- [ ] Run db:generate and db:migrate
- [ ] Run npm run build -- verify clean

## Success Criteria

- `npm run build` passes with zero errors
- `npm run db:generate` produces clean migration SQL
- `npm run db:migrate` applies without error
- Existing wp_v13 localStorage auto-migrates to wp_v14 on load
- New users get DEFAULT_STATE with empty rsvpSettings

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Migration corrupts existing user data | Low | High | Migration only adds new fields; never modifies existing |
| Drizzle migration fails on Neon | Low | Medium | Test locally with db:generate first; review SQL |
| sync.ts breaks with new fields | None | N/A | rsvpSettings is in JSONB blob; no sync.ts changes needed |

## Security Considerations

- `rsvpInvitations.token` is unique and indexed; prevents duplicate tokens
- `userId` column links invitations to planner; no cross-user access possible
- Token is server-generated (nanoid); not user-controllable

## Next Steps

Phase 2 (API Endpoints) depends on this phase completing successfully. The `rsvpInvitations` table must exist before API handlers can query it.
