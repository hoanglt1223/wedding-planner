# Phase 03: Install shadcn Components

## Context Links
- Research: `plans/reports/researcher-shadcn-localStorage.md`
- Existing: `src/components/ui/` (button, card, input, label, separator, badge)

## Overview
- **Priority**: P1 (Group B needs these components)
- **Status**: completed
- **Group**: A (parallel with phases 01, 02)
- **Effort**: 0.5h

## Key Insights
- shadcn/ui 3.8.5 uses `npx shadcn@latest add` command
- Must use `--legacy-peer-deps` if peer dep issues arise
- Each component installed into `src/components/ui/`
- These are owned files (not auto-updated), but treated as library code

## Files Owned (EXCLUSIVE)

### Create (via CLI)
| File | Component | Used By |
|------|-----------|---------|
| `src/components/ui/tabs.tsx` | Tabs, TabsList, TabsTrigger, TabsContent | Phase 04, 07 |
| `src/components/ui/table.tsx` | Table, TableHead, TableRow, etc. | Phase 04, 05 |
| `src/components/ui/progress.tsx` | Progress bar | Phase 04, 05, 07 |
| `src/components/ui/scroll-area.tsx` | ScrollArea | Phase 05 |
| `src/components/ui/slider.tsx` | Slider input | Phase 05 |
| `src/components/ui/textarea.tsx` | Textarea | Phase 06 |

## Implementation Steps

### 1. Install all components in one batch

```bash
npx shadcn@latest add tabs table progress scroll-area slider textarea -y
```

If peer dep issues:
```bash
npm install --legacy-peer-deps
npx shadcn@latest add tabs table progress scroll-area slider textarea -y
```

### 2. Verify imports compile

Create a temporary test or just run `npm run build` to confirm all components resolve correctly.

### 3. Verify component exports

Each installed component should export from `@/components/ui/<name>`. Verify the Tabs component specifically exports:
- `Tabs`
- `TabsList`
- `TabsTrigger`
- `TabsContent`

## Todo List

- [x] Run `npx shadcn@latest add tabs table progress scroll-area slider textarea -y`
- [x] Verify all 6 new component files exist in `src/components/ui/`
- [x] Run `npm run build` to confirm no errors

## Success Criteria
- 6 new files in `src/components/ui/`
- `npm run build` passes
- Total shadcn components: 12 (6 existing + 6 new)

## Risk Assessment
- Low risk; shadcn CLI is well-tested
- If a component conflicts with existing CSS, resolve in Phase 08
