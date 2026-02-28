# Phase 5: Integration Testing

## Context Links

- [Phase 1 — DB Schema](./phase-01-database-schema-migration.md)
- [Phase 2 — API Endpoints](./phase-02-api-endpoints.md)
- [Phase 3 — Guest Page](./phase-03-guest-rsvp-landing-page.md)
- [Phase 4 — Dashboard](./phase-04-planner-rsvp-dashboard.md)

## Overview

- **Priority:** P1
- **Status:** complete
- **Description:** End-to-end validation of the entire RSVP flow. Build verification, lint check, manual test checklists, and edge case coverage.

## Key Insights

- No test framework configured; all testing is manual + build checks
- `npm run build` runs `tsc -b && vite build` -- catches all TS errors
- `npm run lint` runs ESLint -- catches code quality issues
- Vercel local dev: `npm run dev` starts Vite + local API functions

## Requirements

### Functional
- Full planner-to-guest flow works end-to-end
- All error states render correctly
- Build and lint pass with zero errors

### Non-functional
- No console errors during normal flow
- No TypeScript warnings

## Build Verification

```bash
# Step 1: TypeScript + Vite build
npm run build

# Step 2: ESLint
npm run lint

# Step 3: Local dev server (manual testing)
npm run dev
```

## Manual Test Checklists

### Test 1: State Migration

- [ ] Clear localStorage completely
- [ ] Set `wp_v13` key with valid existing data (no rsvpSettings)
- [ ] Reload page
- [ ] Verify `wp_v14` key exists with `rsvpSettings` defaults
- [ ] Verify all existing data preserved (guests, info, budget, etc.)
- [ ] Verify app loads without errors

### Test 2: Fresh User

- [ ] Clear localStorage completely
- [ ] Load app
- [ ] Verify DEFAULT_STATE includes `rsvpSettings` with empty strings
- [ ] Complete onboarding
- [ ] Navigate to Guest panel
- [ ] Verify RSVP tab visible alongside List and Seating

### Test 3: RSVP Settings

- [ ] Open RSVP tab in Guest panel
- [ ] Fill in welcome message, venue, address, map link, couple story
- [ ] Navigate away and back
- [ ] Verify settings persisted
- [ ] Reload page; verify settings survived

### Test 4: Link Generation (No Guests)

- [ ] Open RSVP tab with empty guest list
- [ ] Verify generate button is disabled or shows "add guests first" message
- [ ] Verify no API call made

### Test 5: Link Generation (With Guests)

- [ ] Add 3+ guests to guest list
- [ ] Open RSVP tab
- [ ] Click "Generate Links"
- [ ] Verify loading spinner during API call
- [ ] Verify success: each guest now has rsvpToken in state
- [ ] Switch to List tab and back to RSVP -- tokens persist
- [ ] Click "Generate Links" again -- button disabled (all have tokens)

### Test 6: Guest RSVP Page (Valid Token)

- [ ] Copy a generated RSVP link
- [ ] Open in new browser tab (or incognito)
- [ ] Verify page loads with correct theme
- [ ] Verify guest name displayed correctly
- [ ] Verify couple names, date, venue details shown
- [ ] Verify couple story shown (or hidden if empty)
- [ ] Select "Will Attend"
- [ ] Set plus-ones to 2
- [ ] Enter dietary requirement
- [ ] Enter congratulatory message
- [ ] Click Submit
- [ ] Verify thank-you screen appears with response summary

### Test 7: Guest RSVP Page (Already Responded)

- [ ] Open same RSVP link again
- [ ] Verify thank-you screen shown immediately (no form)
- [ ] Verify response data matches what was submitted

### Test 8: Guest RSVP Page (Invalid Token)

- [ ] Navigate to `#/rsvp/invalidtoken123`
- [ ] Verify error page shown ("Invitation not found")
- [ ] No console errors

### Test 9: Guest RSVP Page (Decline)

- [ ] Use a different guest's token
- [ ] Select "Decline"
- [ ] Enter message only (no plus-ones/dietary fields shown)
- [ ] Submit
- [ ] Verify thank-you screen with "declined" status

### Test 10: Dashboard Data

- [ ] Return to planner app
- [ ] Open RSVP tab
- [ ] Verify stats bar: 1 accepted, 1 declined, 1 pending (based on tests above)
- [ ] Verify response table shows all 3 guests with correct status badges
- [ ] Verify accepted guest shows plus-ones and dietary info
- [ ] Verify pending guest shows gray "pending" badge

### Test 11: QR Code

- [ ] Click QR button on any guest row
- [ ] Verify modal opens with QR code image
- [ ] Scan QR with phone -- verify it navigates to correct RSVP page
- [ ] Close modal

### Test 12: Copy Link

- [ ] Click copy button on a guest row
- [ ] Paste in browser -- verify correct RSVP URL
- [ ] Click "Copy All Links"
- [ ] Paste -- verify formatted list of all guest:URL pairs

### Test 13: CSV Export

- [ ] Click "Export CSV"
- [ ] Open downloaded file
- [ ] Verify columns: Name, Status, Plus-Ones, Dietary, Message, Link
- [ ] Verify data matches dashboard table

### Test 14: Bilingual (English)

- [ ] Switch app language to English
- [ ] Verify RSVP tab label in English
- [ ] Verify settings form labels in English
- [ ] Generate links for a new guest (if possible)
- [ ] Open guest RSVP page -- verify English text
- [ ] Verify form labels and button text in English

### Test 15: Theme Consistency

- [ ] Change planner theme to "Navy"
- [ ] Open guest RSVP page
- [ ] Verify page uses navy theme colors (not default red)
- [ ] Change to "Sage" theme
- [ ] Generate new link (or use existing -- theme comes from user_sessions)
- [ ] Verify sage theme on guest page after sync

### Test 16: Mobile Responsiveness

- [ ] Open RSVP guest page in mobile viewport (375px width)
- [ ] Verify all sections stack vertically
- [ ] Verify form is usable (inputs not clipped)
- [ ] Verify submit button is tappable
- [ ] Open RSVP dashboard in mobile viewport
- [ ] Verify table scrolls horizontally
- [ ] Verify stats bar wraps or stacks

## Edge Cases

- [ ] Guest with very long name (50+ chars) -- verify no layout break
- [ ] Special characters in guest name (Vietnamese diacritics, emojis)
- [ ] Empty couple story -- verify section hidden on guest page
- [ ] Empty venue -- verify event details section hidden
- [ ] 0 plus-ones (accepted) -- verify "0" displayed, not hidden
- [ ] Maximum plus-ones (10) -- verify counter caps
- [ ] Very long dietary/message text (500 chars) -- verify no overflow
- [ ] Network offline during form submit -- verify error handling
- [ ] Rapid double-click on submit button -- verify no double submission

## Todo List

- [ ] Run `npm run build` -- zero errors
- [ ] Run `npm run lint` -- zero warnings
- [ ] Complete Test 1 (State Migration)
- [ ] Complete Test 2 (Fresh User)
- [ ] Complete Tests 3-5 (Settings + Link Generation)
- [ ] Complete Tests 6-9 (Guest Page Flows)
- [ ] Complete Tests 10-13 (Dashboard Features)
- [ ] Complete Tests 14-16 (i18n, Theme, Mobile)
- [ ] Verify edge cases
- [ ] Deploy to Vercel preview and test

## Success Criteria

- `npm run build` exits 0
- `npm run lint` exits 0
- All 16 test scenarios pass
- All edge cases handled without console errors
- Mobile layout renders correctly at 375px

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| API timing issues in local dev | Medium | Low | Use Vercel CLI for local API testing |
| Database not seeded for testing | Medium | Low | Generate links first, then test guest page |
| Rate limiting blocks rapid testing | Low | Low | Use different userIds or wait between tests |

## Next Steps

After all tests pass:
1. Deploy to Vercel production
2. Update `docs/project-overview-pdr.md` with RSVP as completed feature
3. Update `docs/system-architecture.md` with RSVP data flow
4. Update `docs/codebase-summary.md` with new files
