# Phase 02: Hooks + Utilities

## Context Links
- Research: `plans/reports/researcher-shadcn-localStorage.md`
- Source: `docs/wedding-planner.html` lines 144-149 (state mgmt, formatters), 292-294 (CSV)
- Code standards: `docs/code-standards.md`

## Overview
- **Priority**: P1 (foundation for Group B components)
- **Status**: complete
- **Group**: A (parallel with phases 01, 03)
- **Effort**: 1.5h

## Key Insights
- `useLocalStorage` hook should support functional updates like `useState`
- Wedding store wraps `useLocalStorage` with key `wp_v7` and provides typed accessors
- CSV functions handle UTF-8 BOM for Vietnamese text
- Markdown renderer is simple regex-based (not full parser)
- Number formatters use `Intl.NumberFormat('vi-VN')` and custom short format

## Files Owned (EXCLUSIVE)

### Create
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/hooks/use-local-storage.ts` | Generic `useLocalStorage<T>` hook | ~50 |
| `src/hooks/use-wedding-store.ts` | Wedding state management hook | ~100 |
| `src/lib/format.ts` | `formatMoney()`, `formatShort()` number formatters | ~25 |
| `src/lib/csv.ts` | CSV import/export/download helpers | ~80 |
| `src/lib/markdown.ts` | Simple markdown-to-HTML renderer | ~30 |

### Delete
| File | Reason |
|------|--------|
| `src/hooks/.gitkeep` | No longer needed |

## Implementation Steps

### 1. Create `src/hooks/use-local-storage.ts`

Based on research report pattern. Key requirements:
- Lazy initialization (read from localStorage only on mount)
- Functional updates: `setValue(prev => newVal)`
- try-catch for private browsing / quota errors
- `typeof window` check (SSR safe, though not needed for Vite SPA)

```typescript
import { useState, useCallback } from "react";

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (err) {
          console.error(`localStorage write failed for "${key}":`, err);
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
```

### 2. Create `src/hooks/use-wedding-store.ts`

Wraps `useLocalStorage` with typed `WeddingState`. Provides convenience methods:

```typescript
import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { WeddingState, Guest } from "@/types/wedding";
import { DEFAULT_STATE } from "@/data/backgrounds";
import { WEDDING_STEPS } from "@/data/wedding-steps";

const STORAGE_KEY = "wp_v7";

export function useWeddingStore() {
  const [state, setState] = useLocalStorage<WeddingState>(
    STORAGE_KEY,
    DEFAULT_STATE,
  );

  const setTab = useCallback((tab: number) => {
    setState((prev) => ({ ...prev, tab }));
  }, [setState]);

  const setSubTab = useCallback((stepId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      st: { ...prev.st, [stepId]: index },
    }));
  }, [setState]);

  const toggleCheck = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      ck: { ...prev.ck, [key]: !prev.ck[key] },
    }));
  }, [setState]);

  const setBudget = useCallback((bud: number) => {
    setState((prev) => ({ ...prev, bud }));
  }, [setState]);

  const setCategoryPercent = useCallback((key: string, pct: number) => {
    setState((prev) => ({
      ...prev,
      bo: { ...prev.bo, [key]: pct },
    }));
  }, [setState]);

  const updateInfo = useCallback(
    (field: string, value: string) => {
      setState((prev) => ({
        ...prev,
        info: { ...prev.info, [field]: value },
      }));
    },
    [setState],
  );

  const addGuest = useCallback((guest: Omit<Guest, "id">) => {
    setState((prev) => ({
      ...prev,
      gid: prev.gid + 1,
      guests: [...prev.guests, { ...guest, id: prev.gid + 1 }],
    }));
  }, [setState]);

  const removeGuest = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
  }, [setState]);

  const clearGuests = useCallback(() => {
    setState((prev) => ({ ...prev, guests: [] }));
  }, [setState]);

  const importGuests = useCallback((newGuests: Omit<Guest, "id">[]) => {
    setState((prev) => {
      let gid = prev.gid;
      const guests = [
        ...prev.guests,
        ...newGuests.map((g) => ({ ...g, id: ++gid })),
      ];
      return { ...prev, guests, gid };
    });
  }, [setState]);

  const setApiKey = useCallback((zk: string) => {
    setState((prev) => ({ ...prev, zk }));
  }, [setState]);

  const setAiResponse = useCallback((ar: string) => {
    setState((prev) => ({ ...prev, ar }));
  }, [setState]);

  // Computed: checklist progress
  const getProgress = useCallback(() => {
    let total = 0;
    let done = 0;
    WEDDING_STEPS.forEach((s) =>
      s.cers.forEach((c, ci) =>
        c.cl.forEach((_, i) => {
          total++;
          if (state.ck[`${s.id}_${ci}_${i}`]) done++;
        }),
      ),
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [state.ck]);

  return {
    state,
    setState,
    setTab,
    setSubTab,
    toggleCheck,
    setBudget,
    setCategoryPercent,
    updateInfo,
    addGuest,
    removeGuest,
    clearGuests,
    importGuests,
    setApiKey,
    setAiResponse,
    getProgress,
  };
}

export type WeddingStore = ReturnType<typeof useWeddingStore>;
```

### 3. Create `src/lib/format.ts`

```typescript
/** Format number as vi-VN locale (e.g. 200.000.000) */
export function formatMoney(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n));
}

/** Format number in short form (e.g. 200tr, 1tỷ, 500k) */
export function formatShort(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + "tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + "tr";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "k";
  return String(n);
}
```

### 4. Create `src/lib/csv.ts`

```typescript
import type { Guest } from "@/types/wedding";

const CSV_HEADER = "Họ tên,SĐT,Bên,Nhóm";
const BOM = "\uFEFF";

/** Download a sample CSV template */
export function downloadSampleCsv(): void {
  const csv = `${CSV_HEADER}\nNguyễn A,0901234567,trai,Bàn 1\nTrần B,0912345678,gai,Họ hàng`;
  downloadBlob(BOM + csv, "khach_moi_mau.csv");
}

/** Export current guest list to CSV */
export function exportGuestsCsv(guests: Guest[]): void {
  let csv = CSV_HEADER + "\n";
  guests.forEach((g) => {
    csv += `${g.n},${g.p || ""},${g.s},${g.g || ""}\n`;
  });
  downloadBlob(BOM + csv, "khach_moi.csv");
}

/** Parse CSV text into guest array (skip header row) */
export function parseCsvToGuests(
  text: string,
): Omit<Guest, "id">[] {
  return text
    .split("\n")
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return {
        n: parts[0] || "",
        p: parts[1] || "",
        s: parts[2] || "trai",
        g: parts[3] || "",
      };
    })
    .filter((g) => g.n);
}

/** Read a File as UTF-8 text */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsText(file, "UTF-8");
  });
}

function downloadBlob(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

### 5. Create `src/lib/markdown.ts`

Simple regex renderer matching HTML `fA()` function:

```typescript
/** Convert simple markdown to HTML (headings, bold, lists, line breaks) */
export function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /^### (.*$)/gm,
      '<h4 class="text-amber-400 mt-3 mb-1">$1</h4>',
    )
    .replace(
      /^## (.*$)/gm,
      '<h3 class="text-amber-400 mt-4 mb-1.5">$1</h3>',
    )
    .replace(
      /^# (.*$)/gm,
      '<h2 class="text-amber-300 mt-5 mb-2">$1</h2>',
    )
    .replace(
      /^[-*] (.*$)/gm,
      '<div class="py-0.5 pl-2 border-l-2 border-white/10">$1</div>',
    )
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}
```

## Todo List

- [x] Create `src/hooks/use-local-storage.ts`
- [x] Create `src/hooks/use-wedding-store.ts`
- [x] Create `src/lib/format.ts`
- [x] Create `src/lib/csv.ts`
- [x] Create `src/lib/markdown.ts`
- [x] Remove `src/hooks/.gitkeep` (was not present)
- [x] Run `npm run build` to verify types compile (only Phase 01 missing-module errors remain)

## Success Criteria
- `useWeddingStore()` returns fully typed state with all action methods
- `formatMoney(200000000)` returns `"200.000.000"`
- `formatShort(200000000)` returns `"200tr"`
- CSV round-trip: export then import preserves data
- No file exceeds 200 lines

## Risk Assessment
- `useWeddingStore` may grow large; if over 200 lines, split computed functions into a separate `use-wedding-computed.ts`
- Markdown renderer is intentionally minimal; complex markdown won't render

## Security Considerations
- API key (`zk`) is stored in localStorage (same as original HTML behavior)
- CSV import should sanitize input; current implementation only splits on commas
