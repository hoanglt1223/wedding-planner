# Phase 06: Cards + AI + Print + Ideas Components

## Context Links
- Source: `docs/wedding-planner.html` lines 196-280 (`rBGThiep`, `rAI`, `rPrint`, `rIdea`)
- Research: `plans/reports/researcher-zhipuai-api.md` (ZhipuAI API)
- Types: `src/types/wedding.ts` (Phase 01)
- Data: `src/data/backgrounds.ts`, `src/data/ai-prompts.ts`, `src/data/ideas.ts` (Phase 01)
- Lib: `src/lib/markdown.ts` (Phase 02)

## Overview
- **Priority**: P1
- **Status**: pending
- **Group**: B (parallel with phases 04, 05; depends on Group A)
- **Effort**: 2.5h

## Key Insights

### Cards Panel (BG & Thiep)
- Couple info form at top (names, families, 3 dates)
- 3 events (Dam Ngo, Dam Hoi, Tiec Cuoi), each generates:
  - 10 background cards (gradient + text overlay)
  - 10 invitation cards (more elaborate, with invitation text)
- Styles from `BACKGROUNDS[]` — CSS gradients with Google Fonts
- Date formatting: `fmD` (full weekday), `fmDs` (dd/mm/yyyy)

### AI Panel
- Dark theme container (gradient bg)
- API key input (password type)
- 16 quick prompt buttons in a flex-wrap grid
- Custom textarea + Send/Clear buttons
- Response area with markdown rendering
- API call goes to ZhipuAI endpoint (Phase 07 will proxy via `/api/ai/chat.ts`)
- For now, component calls API directly (like HTML does); Phase 07 can add proxy

### Print Panel
- "In So Tay" button (triggers `window.print()`)
- Full handbook view: couple info header, then all steps with checklists and ritual steps
- Hidden in `@media print` except this panel's content

### Ideas Panel
- Static display of 14 idea cards
- Purple gradient background container
- Each idea: icon + bold title + description

## Files Owned (EXCLUSIVE)

### Create
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/cards/cards-panel.tsx` | Container: couple form + 3 events | ~80 |
| `src/components/cards/couple-info-form.tsx` | Edit form for couple info | ~80 |
| `src/components/cards/background-grid.tsx` | 10 background cards for one event | ~60 |
| `src/components/cards/invitation-grid.tsx` | 10 invitation cards for one event | ~80 |
| `src/components/ai/ai-panel.tsx` | AI assistant container | ~120 |
| `src/components/ai/ai-prompt-buttons.tsx` | Quick prompt button grid | ~35 |
| `src/components/print/print-panel.tsx` | Print handbook view | ~100 |
| `src/components/ideas/ideas-panel.tsx` | Ideas display | ~50 |

## Implementation Steps

### 1. Create `src/components/cards/couple-info-form.tsx`

Props: `{ info, onUpdateInfo }`. Renders:
- Row 1: Bride input + Groom input
- Row 2: Bride family + Groom family
- Row 3: Dam Ngo date + Dam Hoi date + Wedding date

All inputs call `onUpdateInfo(field, value)` onChange.

### 2. Create `src/components/cards/background-grid.tsx`

Props: `{ event, groom, bride, groomFamily, brideFamily, backgrounds }`.

```typescript
interface BackgroundGridProps {
  eventName: string;
  date: string;          // formatted short date
  groom: string;
  bride: string;
  groomFamily: string;
  brideFamily: string;
  backgrounds: BackgroundStyle[];
}
```

Renders responsive grid of 10 cards. Each card:
- `style={{ background: bg.bg, fontFamily: bg.f }}`
- Event name (small uppercase, accent color)
- "Groom & Bride" (large, text color)
- Date (accent color)
- "Family1 heart Family2" (small, faded)

### 3. Create `src/components/cards/invitation-grid.tsx`

Similar to background grid but with invitation text. Props add `invitationMessage` per event type. Each card includes:
- "THIEP MOI" header
- Family names
- Invitation message
- Groom & Bride (large)
- Divider line
- Date (full format with weekday)
- "Su hien dien..." footer text

### 4. Create `src/components/cards/cards-panel.tsx`

Orchestrates: `CoupleInfoForm` + 3 events, each rendering `BackgroundGrid` + `InvitationGrid`.

Date formatters (inline):
```typescript
const formatDateShort = (d: string) =>
  d ? new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric"
  }) : "__.__.____";

const formatDateFull = (d: string) =>
  d ? new Date(d).toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
  }) : "...";
```

Invitation messages per event:
- "Tiec Cuoi" -> "Tran trong kinh moi quy khach den chung vui"
- "Dam Hoi" -> "Kinh moi quy khach den du le dinh hon"
- Default -> "Kinh moi quy khach den du buoi le"

### 5. Create `src/components/ai/ai-prompt-buttons.tsx`

Props: `{ prompts, onSelect }`. Simple flex-wrap grid of buttons styled with dark theme.

### 6. Create `src/components/ai/ai-panel.tsx`

Props from store: `{ apiKey, aiResponse, onSetApiKey, onSetAiResponse }`.

State: `isLoading`, `customPrompt`.

Structure:
1. Dark gradient container
2. "AI Ho Tro" header
3. API key password input
4. Model info text
5. `AiPromptButtons` with `onSelect` handler
6. Custom textarea + Send/Clear buttons
7. Response area (uses `renderMarkdown` + `dangerouslySetInnerHTML`)

API call function (direct to ZhipuAI, matching HTML behavior):
```typescript
async function callAI(prompt: string, apiKey: string, budget: string): Promise<string> {
  if (!apiKey) throw new Error("Nhap API Key!");
  const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-4-flash",
      messages: [
        {
          role: "system",
          content: `Chuyen gia dam cuoi VN 20 nam kinh nghiem. 3 mien. Chi tiet, co gia VND. Budget: ${budget}.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Khong phan hoi.";
}
```

Note: Phase 07 may optionally add a Vercel proxy at `/api/ai/chat.ts`. The direct call works for now (same as original HTML).

### 7. Create `src/components/print/print-panel.tsx`

Props: `{ info, steps }`. Renders:
1. Print button (hidden in @media print via `no-print` class)
2. Handbook header: title, couple names, family names
3. For each step: step title, then each ceremony with checklist items and ritual steps

Uses plain HTML/Tailwind styling. No interactivity (read-only view).

### 8. Create `src/components/ideas/ideas-panel.tsx`

Props: none (imports `IDEAS` data directly).

Purple gradient container with idea cards. Each card shows icon, bold title, description.

## Todo List

- [ ] Create `src/components/cards/couple-info-form.tsx`
- [ ] Create `src/components/cards/background-grid.tsx`
- [ ] Create `src/components/cards/invitation-grid.tsx`
- [ ] Create `src/components/cards/cards-panel.tsx`
- [ ] Create `src/components/ai/ai-prompt-buttons.tsx`
- [ ] Create `src/components/ai/ai-panel.tsx`
- [ ] Create `src/components/print/print-panel.tsx`
- [ ] Create `src/components/ideas/ideas-panel.tsx`
- [ ] Run `npm run build` to verify all components compile

## Success Criteria
- Cards panel: 10 backgrounds + 10 invitations per event (30 total each), all styles match
- Google Fonts render correctly (loaded in Phase 07 via index.html link)
- AI panel: prompt buttons fill textarea, send calls API, response renders markdown
- Print panel: shows full handbook content, print button triggers `window.print()`
- Ideas panel: 14 idea cards render correctly
- All Vietnamese text matches HTML source
- No file exceeds 200 lines

## Risk Assessment
- `ai-panel.tsx` at ~120 lines is the largest; keep API call logic lean
- `invitation-grid.tsx` has elaborate inline styles; use Tailwind where possible, `style` prop for dynamic values
- `dangerouslySetInnerHTML` for markdown: acceptable since content comes from AI API, not user HTML injection

## Security Considerations
- AI API key handled client-side (same as HTML original); future improvement could use server proxy
- `dangerouslySetInnerHTML` used for AI response rendering; content is from trusted API, but markdown renderer strips HTML
- No form submission to external servers from cards panel
