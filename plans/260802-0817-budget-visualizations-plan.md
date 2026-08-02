# Budget Visualizations Feature Plan

## Overview
Add visual breakdowns and charts to existing Budget tracking feature to help couples understand spending patterns at a glance.

## Current State
- Budget tracking exists in Phase 3 with expense CRUD
- Data stored in `WeddingState.expenseEntries: ExpenseEntry[]`
- Budget tab shows raw table and CSV export
- No visual representation of spending data

## Proposed Implementation

### Components to Create
1. **Category Breakdown Chart** (`budget-category-chart.tsx`)
   - CSS-based horizontal bar chart
   - Shows spending by category (ceremony, reception, attire, etc.)
   - Color-coded bars with percentage labels
   - Responsive design for mobile

2. **Budget vs Actual Comparison** (`budget-progress-bar.tsx`)
   - Progress bars for each category
   - Shows budget limit vs actual spending
   - Visual indicators (green/yellow/red) for budget health
   - Percentage completion

3. **Spending Trend Timeline** (`budget-trend-chart.tsx`)
   - Monthly spending timeline
   - Simple line chart using SVG
   - Shows spending patterns over time
   - Helps identify spending spikes

4. **Summary Dashboard Cards** (Enhanced)
   - Visual budget health indicators
   - Donut chart for overall budget breakdown
   - Quick stats with icons

### Files to Modify
- `src/pages/planning-page.tsx` - Add visualization section to Budget tab
- `src/components/budget/` - Create new components directory

### Implementation Steps
1. Create budget components directory structure
2. Build category breakdown chart component
3. Build budget vs actual comparison component
4. Build spending trend chart component
5. Update Budget tab layout to integrate visualizations
6. Add responsive breakpoints for mobile
7. Test with sample expense data
8. Run `npm run build` to ensure no errors

### Design Considerations
- Follow existing Tailwind CSS v4 patterns
- Use project's color theme variables
- Mobile-first responsive design
- Maintain existing Vietnamese/English bilingual support
- Keep components under 200 lines (modularization rule)

### Technical Notes
- Use pure CSS/SVG for charts (no external charting libraries)
- Leverage existing `expenseEntries` state structure
- Reuse existing category system
- Follow admin panel chart pattern from `admin-analytics.tsx`
- No new dependencies required

### Success Criteria
- Budget tab shows visual breakdown of spending
- Charts render correctly on mobile (375px+)
- Build passes with zero TypeScript errors
- Visualizations update in real-time with expense changes
- Works with both Vietnamese and English locales

## Estimated Impact
- Development time: 1-2 hours
- Bundle size impact: +5-10KB (CSS/SVG only)
- User value: High (makes budget data actionable)
