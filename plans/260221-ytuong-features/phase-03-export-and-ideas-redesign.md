# Phase 3: Data Export/Import + Ideas Page Redesign

## Overview
1. Add JSON data export/import functionality
2. Redesign Ideas page to show feature status and include export/import controls

## Files to Create
- `src/lib/export.ts` - JSON export/import utilities

## Files to Modify
- `src/data/ideas.ts` - Add status field to ideas
- `src/components/ideas/ideas-panel.tsx` - Complete redesign
- `src/pages/page-router.tsx` - Pass state+store to IdeasPanel

## Implementation Steps

### 1. Create `src/lib/export.ts`
```ts
import type { WeddingState } from "@/types/wedding";

export function exportToJson(state: WeddingState): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `wedding-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function readJsonFile(file: File): Promise<WeddingState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch { reject(new Error("Invalid JSON")); }
    };
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsText(file, "UTF-8");
  });
}
```

### 2. Update `src/data/ideas.ts`
Add `status` field: "done" | "planned" | "future"
```ts
export interface IdeaItemExt {
  icon: string;
  title: string;
  desc: string;
  status: "done" | "planned" | "future";
}
```
Mark relevant ideas as "done" after implementation:
- Countdown timer -> done
- Dashboard chi phi thuc te -> done
- Luu tru vinh vien (export) -> done
- Others -> "planned" or "future"

### 3. Update `src/pages/page-router.tsx`
Pass state and store.setState to IdeasPanel:
```tsx
case "ytuong":
  return <IdeasPanel state={state} onImportState={store.setState} />;
```

### 4. Redesign `src/components/ideas/ideas-panel.tsx`
New layout:
- Top: "Data Export/Import" card with Export JSON + Import JSON buttons
- Middle: Ideas list with status badges (done=green, planned=amber, future=gray)
- Group ideas by status: implemented first, then planned, then future
- Bottom: CTA to use AI tab

Props: `state: WeddingState`, `onImportState: (fn: (prev: WeddingState) => WeddingState) => void`

## Success Criteria
- Export downloads valid JSON of full wedding state
- Import reads JSON and restores state
- Ideas show implementation status with colored badges
- Clean, organized layout
