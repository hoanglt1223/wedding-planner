# Code Review: Wedding Planner React Conversion

**Date:** 2026-02-21
**Reviewer:** code-reviewer
**Scope:** Full React conversion -- 48 files, ~2,755 LOC (excluding shadcn/ui)
**Focus:** TypeScript correctness, security, runtime bugs, performance

---

## Overall Assessment

Solid conversion. TypeScript compiles with zero errors. ESLint clean (3 warnings only in shadcn/ui, out of scope). All files under 200-line limit. Component decomposition is well done -- clear separation of concerns across wedding steps, budget, guests, cards, AI, print, and ideas panels.

**Verdict: Ship-ready with 2 critical fixes (XSS, API key leak).**

---

## Critical Issues

### 1. [CRITICAL] XSS Vulnerability via `dangerouslySetInnerHTML` in AI Panel

**File:** `D:\Projects\wedding-planner\src\components\ai\ai-panel.tsx` (line 138)
**File:** `D:\Projects\wedding-planner\src\lib\markdown.ts`

The AI response from ZhipuAI is rendered via `dangerouslySetInnerHTML` after a regex-based markdown-to-HTML conversion. The `renderMarkdown()` function does **zero sanitization**. If the AI model returns HTML/script content (or if the API is compromised), arbitrary JavaScript executes in the user's browser.

```tsx
// ai-panel.tsx:138
<div dangerouslySetInnerHTML={{ __html: renderMarkdown(aiResponse) }} />
```

The `renderMarkdown()` function in `markdown.ts` only converts markdown syntax to HTML tags but never escapes `<`, `>`, `&`, or `"` characters in the source text.

**Impact:** Stored XSS -- the AI response is persisted in localStorage (`state.ar`), so the attack survives page reloads.

**Fix:** Sanitize HTML before rendering. Either:
- Use `DOMPurify` (npm package) to sanitize the output of `renderMarkdown()`
- Or escape HTML entities in the raw text BEFORE applying markdown regex transforms

```ts
// Option A: Add DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(aiResponse)) }} />

// Option B: Escape first in markdown.ts
function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
export function renderMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // ...rest of transforms
}
```

### 2. [CRITICAL] API Key Stored in localStorage and Sent from Client

**File:** `D:\Projects\wedding-planner\src\components\ai\ai-panel.tsx` (lines 14-37)
**File:** `D:\Projects\wedding-planner\api\ai\chat.ts`

Two problems:

**a) API key in localStorage:** The ZhipuAI API key (`state.zk`) is stored in localStorage as part of the full wedding state. Any XSS (including the vulnerability above) can exfiltrate it.

**b) Client calls API directly, bypassing serverless proxy:** The `ai-panel.tsx` `callAI()` function calls `https://open.bigmodel.cn/api/paas/v4/chat/completions` directly from the browser (line 16), exposing the API key in network requests visible in DevTools. The serverless function at `api/ai/chat.ts` exists but is unused.

**Fix:** Route all AI calls through the serverless proxy:
```ts
// ai-panel.tsx -- use the proxy instead of direct API call
async function callAI(prompt: string, apiKey: string, budget: number): Promise<string> {
  if (!apiKey) throw new Error("Nhap API Key!");
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, apiKey, budget }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Khong phan hoi.";
}
```

Even with the proxy, the API key still goes from client to server to ZhipuAI. Ideal fix: store the API key server-side (environment variable or encrypted DB), not in client state. But given this is a personal planning tool, the proxy approach is an acceptable compromise.

---

## High Priority

### 3. [HIGH] Guest Delete Uses Array Index, Not Stable ID

**File:** `D:\Projects\wedding-planner\src\components\guests\guest-table.tsx` (line 44)
**File:** `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` (line 62-66)

The `onDelete` callback receives the array index `i`, but the guest table is rendered from `filteredGuests` (a search-filtered subset). The index passed to `removeGuest` refers to the filtered array position, not the original array position.

```tsx
// guest-table.tsx:44 -- passes filtered index
onClick={() => onDelete(i)}

// guest-panel.tsx:143 -- passes filtered guests
<GuestTable guests={filteredGuests} onDelete={onRemoveGuest} />

// use-wedding-store.ts:62-66 -- removes by index from full array
const removeGuest = useCallback((index: number) => {
  setState((prev) => ({
    ...prev,
    guests: prev.guests.filter((_, i) => i !== index),
  }));
}, [setState]);
```

**Bug scenario:** User searches for "Nguyen", gets 3 results. Deletes the 2nd result (index 1). But index 1 in the full array is a completely different guest.

**Fix:** Delete by guest ID instead of index:
```ts
// use-wedding-store.ts
const removeGuest = useCallback((guestId: number) => {
  setState((prev) => ({
    ...prev,
    guests: prev.guests.filter((g) => g.id !== guestId),
  }));
}, [setState]);

// guest-table.tsx
onClick={() => onDelete(g.id)}
```

### 4. [HIGH] Budget Input Uses `defaultValue` -- Stale on Preset Click

**File:** `D:\Projects\wedding-planner\src\components\budget\budget-panel.tsx` (line 53)

The budget input uses `defaultValue={formatMoney(budget)}` making it an uncontrolled input. When the user clicks a preset button (e.g., "200tr"), the state updates but the input display does NOT update because React does not re-render uncontrolled inputs on `defaultValue` changes.

```tsx
<input
  defaultValue={formatMoney(budget)}  // never updates after mount
  onInput={handleBudgetInput}
/>
```

**Fix:** Switch to controlled input with `value`:
```tsx
<input
  value={formatMoney(budget)}
  onChange={handleBudgetInput}
  onFocus={(e) => e.target.select()}
/>
```

The `handleBudgetInput` function also manually sets `e.target.value` (line 32), which is an anti-pattern with controlled inputs. Remove that line when switching to `value`.

### 5. [HIGH] `updateInfo` Field Parameter Is Untyped String

**File:** `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` (line 44-52)

```ts
const updateInfo = useCallback(
  (field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      info: { ...prev.info, [field]: value },
    }));
  },
  [setState],
);
```

The `field` parameter is `string`, allowing any arbitrary key to be set on the `info` object. Should be `keyof CoupleInfo`:

```ts
const updateInfo = useCallback(
  (field: keyof CoupleInfo, value: string) => { ... },
  [setState],
);
```

This requires updating `CardsPanel` and `CoupleInfoForm` prop types to match.

---

## Medium Priority

### 6. [MEDIUM] `getProgress` Recomputes on Every Render

**File:** `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` (lines 92-104)

`getProgress` is wrapped in `useCallback` depending on `state.ck`, but it is a **function that returns a value**, not a stable callback. It recomputes every time `state.ck` changes, and `App.tsx` calls it on every render (line 16). Since the return is a new object each time, it could cause unnecessary re-renders of child components receiving progress props.

This is low-impact currently (small app), but would be cleaner as `useMemo`:

```ts
const progress = useMemo(() => {
  let total = 0, done = 0;
  WEDDING_STEPS.forEach(s => s.cers.forEach((c, ci) =>
    c.cl.forEach((_item, i) => { total++; if (state.ck[`${s.id}_${ci}_${i}`]) done++; })
  ));
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}, [state.ck]);
```

### 7. [MEDIUM] CSV Parsing Has No Validation for Malicious Content

**File:** `D:\Projects\wedding-planner\src\lib\csv.ts` (lines 22-37)

The CSV parser splits on commas naively -- no support for quoted fields containing commas or newlines. A guest name like `"Nguyen, Van A"` would be split incorrectly. Also, no CSV injection protection (cells starting with `=`, `+`, `-`, `@` could be exploited if exported to Excel).

For a personal wedding planner this is acceptable risk, but worth noting.

### 8. [MEDIUM] `handlePromptSelect` Calls `handleSend` Without `await`

**File:** `D:\Projects\wedding-planner\src\components\ai\ai-panel.tsx` (lines 59-62)

```ts
const handlePromptSelect = (prompt: string) => {
  setCustomPrompt(prompt);
  handleSend(prompt);  // missing await, unhandled promise
};
```

The returned promise from `handleSend` is not awaited and not caught. If the fetch fails after the `try/catch` in `handleSend`, the error is silently swallowed. Should be:

```ts
const handlePromptSelect = (prompt: string) => {
  setCustomPrompt(prompt);
  void handleSend(prompt);
};
```

Or make `handlePromptSelect` async and await it.

### 9. [MEDIUM] `api/ai/chat.ts` Response Not Validated

**File:** `D:\Projects\wedding-planner\api\ai\chat.ts` (line 40-41)

```ts
const data = await res.json();
return Response.json(data);
```

The response from ZhipuAI is blindly proxied to the client. If the upstream API returns unexpected data or an error object, the client receives it raw. Should check `res.ok` before parsing and return structured error on failure.

---

## Low Priority

### 10. [LOW] `RootLayout` Component is Unused

**File:** `D:\Projects\wedding-planner\src\components\layout\root-layout.tsx`

This component wraps children with a footer, but `App.tsx` renders `Header` and `Footer` directly. `RootLayout` is dead code.

### 11. [LOW] Array Index Keys in Several Lists

Several components use array index as `key` prop: `PeopleGrid` (line 12), `RitualTimeline` (line 13), `BackgroundGrid` (line 25), `InvitationGrid` (line 24), `AiPromptButtons` (line 11). These are all static data lists that never reorder, so this is functionally correct but not ideal React practice.

### 12. [LOW] Missing `async` Error Handling in CSV Import

**File:** `D:\Projects\wedding-planner\src\components\guests\guest-panel.tsx` (lines 49-56)

```ts
const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await readFileAsText(file);  // can throw
  const newGuests = parseCsvToGuests(text);
  onImportGuests(newGuests);
};
```

No try/catch. If `readFileAsText` rejects, the error is unhandled. Should wrap in try/catch with user feedback.

---

## Positive Observations

- Clean TypeScript: zero compiler errors across entire codebase
- Excellent file decomposition: largest file is 149 lines (guest-panel), all under 200-line limit
- Wedding step data properly split into individual files to avoid monolithic data blobs
- `useLocalStorage` hook is well-implemented with error handling for write failures
- `useWeddingStore` uses proper `useCallback` memoization throughout
- Props are properly typed with explicit interfaces for every component
- No `any` types found anywhere in the codebase
- Budget panel has good UX: preset buttons, percentage-based allocation, visual progress bars
- Guest panel has search, import/export CSV, and side/group filtering
- Data files are well-structured with consistent typing via shared interfaces

---

## Metrics

| Metric | Value |
|--------|-------|
| Files reviewed | 48 |
| Total LOC | 2,755 |
| TypeScript errors | 0 |
| ESLint errors (in scope) | 0 |
| Critical issues | 2 |
| High issues | 3 |
| Medium issues | 4 |
| Low issues | 3 |
| `any` types | 0 |
| Max file size | 149 lines |

---

## Recommended Actions (Priority Order)

1. **[CRITICAL]** Sanitize AI response HTML -- add `DOMPurify` or escape HTML entities before `dangerouslySetInnerHTML`
2. **[CRITICAL]** Route AI calls through `/api/ai/chat` proxy instead of direct browser-to-ZhipuAI calls
3. **[HIGH]** Fix guest delete to use `guest.id` instead of array index (wrong guest deleted when search is active)
4. **[HIGH]** Change budget input from `defaultValue` to `value` (controlled) so preset buttons update display
5. **[HIGH]** Type `updateInfo` field param as `keyof CoupleInfo` instead of `string`
6. **[MEDIUM]** Add `res.ok` check in `api/ai/chat.ts` before proxying upstream response
7. **[MEDIUM]** Add try/catch to CSV import handler
8. **[LOW]** Remove unused `RootLayout` component
