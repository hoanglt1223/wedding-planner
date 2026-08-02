# Guest Group Management Feature Plan

## Overview
Add group functionality to existing guest management system to help couples organize guests by relationship (family, friends, colleagues, etc.) for easier RSVP tracking, seating, and communications.

## Current State
- Guest management exists with guest CRUD operations
- Guest interface has name, side (bride/groom), RSVP token, contact info
- Groups would make large guest lists more manageable
- Useful for organizing invites, seating plans, and communications

## Proposed Implementation

### Feature Scope
1. **Group Categories** - Pre-defined and custom groups
   - Default groups: Family (Bride), Family (Groom), Friends (Bride), Friends (Groom), Colleagues (Bride), Colleagues (Groom), VIP, Service Providers
   - Support custom group creation
   - Color-coded group badges

2. **Group Assignment UI** - Easy group selection
   - Add group dropdown/selector to guest form
   - Batch assign groups from guest list
   - Group filter in guest dashboard
   - Group statistics and counts

3. **Group-Based Views** - Organize by groups
   - Filter guests by group
   - Group-based summary cards
   - Export guests by group
   - Group-based RSVP tracking

### Files to Modify
- `src/types/wedding.ts` - Add `group` field to Guest interface
- `src/components/guests/guest-form.tsx` - Add group selector
- `src/components/guests/guest-list.tsx` - Add group filter and badges
- `src/pages/guests-page.tsx` - Add group statistics
- `src/data/guest-groups.ts` - Define group categories (new file)

### Implementation Steps
1. Create guest groups data file with default groups
2. Add group field to Guest type definition
3. Update guest form to include group selector
4. Add group filter to guest list view
5. Create group statistics summary component
6. Add group badges to guest cards
7. Update CSV export to include group column
8. Add group-based RSVP response tracking
9. Implement Vietnamese/English translations for groups
10. Test with sample guest data

### Design Considerations
- Mobile-friendly group selector
- Color-coded group badges for quick visual identification
- Group management (add/edit/remove custom groups)
- Filter guests by single or multiple groups
- Group-based export for seating planning

### Technical Notes
- Extend existing Guest interface with optional `group?: string` field
- Group data stored in WeddingState (no new API endpoint needed)
- Use existing color system for group badges
- Follow existing responsive patterns
- No new dependencies required

### Success Criteria
- Guests can be assigned to groups during creation/editing
- Guest list can be filtered by group
- Group statistics show on dashboard
- Export includes group information
- Works with both Vietnamese and English locales
- Build passes with zero TypeScript errors

## Estimated Impact
- Development time: 2-3 hours
- Bundle size impact: +2-3KB (minimal)
- User value: High (organizes large guest lists)
- Use cases: Seating plans, invitation batches, communication groups
