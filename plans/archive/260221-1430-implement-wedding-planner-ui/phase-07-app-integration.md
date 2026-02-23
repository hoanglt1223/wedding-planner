# Phase 07: App Integration + Layout + API

## Context Links
- Source: `docs/wedding-planner.html` lines 93-94 (header), 151-162 (`R()` function)
- Existing: `src/App.tsx`, `src/components/layout/*`
- All Phase 04-06 components

## Overview
- **Priority**: P1
- **Status**: complete
- **Group**: C (sequential; depends on ALL of Group B)
- **Effort**: 2h

## Key Insights
- `App.tsx` is the central orchestrator: manages tab state, renders all panels
- Header becomes the wedding-specific progress header (replaces generic one)
- Footer stays minimal
- Tab navigation: 7 step tabs + 6 extra tabs = 13 total, horizontal scrollable
- Only the active tab panel is visible (CSS display toggle in original; React conditional render)
- Toast notification for save is replaced by a simple fixed-position div with CSS transition
- Google Fonts must be imported in `index.html` `<head>`
- API proxy for ZhipuAI is optional but good practice (hides API key from client)

## Files Owned (EXCLUSIVE)

### Modify
| File | Changes |
|------|---------|
| `src/App.tsx` | Complete rewrite: import store + all panels, render based on tab |
| `src/components/layout/header.tsx` | Rewrite: wedding progress header with gradient |
| `src/components/layout/footer.tsx` | Minor update: keep minimal, match original |
| `index.html` | Add Google Fonts link in `<head>` |

### Create
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/wedding/tab-navigation.tsx` | Horizontal scrollable tab bar | ~60 |
| `src/components/wedding/save-toast.tsx` | Fixed-position save notification | ~30 |
| `api/ai/chat.ts` | Vercel serverless proxy for ZhipuAI | ~60 |

## Implementation Steps

### 1. Create `src/components/wedding/tab-navigation.tsx`

Props: `{ activeTab, onTabChange }`.

Renders a horizontal scrollable div with tab buttons:
- First 7: from `WEDDING_STEPS[].tab`
- Next 6: from `EXTRA_TABS[]`

Active tab gets red bg + white text. Uses `overflow-x-auto` with hidden scrollbar.

```typescript
import { WEDDING_STEPS } from "@/data/wedding-steps";
import { EXTRA_TABS } from "@/data/backgrounds";

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const allTabs = [
    ...WEDDING_STEPS.map((s) => s.tab),
    ...EXTRA_TABS,
  ];
  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {allTabs.map((label, i) => (
        <button
          key={i}
          onClick={() => onTabChange(i)}
          className={`shrink-0 px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-colors whitespace-nowrap ${
            i === activeTab
              ? "bg-red-700 text-white border-red-700"
              : "bg-white border-amber-200 hover:border-red-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

### 2. Create `src/components/wedding/save-toast.tsx`

A simple fixed-position toast that shows "Da luu" briefly. Controlled by parent via prop.

```typescript
interface SaveToastProps {
  visible: boolean;
}

export function SaveToast({ visible }: SaveToastProps) {
  return (
    <div
      className={`fixed bottom-2.5 right-2.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold z-50 transition-opacity duration-300 pointer-events-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      💾 Đã lưu
    </div>
  );
}
```

### 3. Rewrite `src/components/layout/header.tsx`

Wedding-specific header with gradient background matching HTML `.hd` class:

```typescript
import { Progress } from "@/components/ui/progress";

interface HeaderProps {
  progressPct: number;
  done: number;
  total: number;
}

export function Header({ progressPct, done, total }: HeaderProps) {
  return (
    <header className="text-center px-3 py-5 pb-4 bg-gradient-to-br from-[#8b1a2b] to-[#c0392b] text-white rounded-b-2xl mb-3">
      <h1 className="text-[clamp(1.3rem,4vw,1.9rem)] font-bold">
        💒 Kế Hoạch Đám Cưới Việt Nam
      </h1>
      <p className="opacity-80 text-[0.82rem] mt-0.5">
        Ultimate Edition — Đầy đủ & Chi tiết nhất
      </p>
      <div className="mt-2 mb-0.5">
        <Progress value={progressPct} className="h-[7px] bg-white/20" />
      </div>
      <div className="text-[0.72rem] opacity-75 text-right">
        {progressPct}% ({done}/{total})
      </div>
    </header>
  );
}
```

### 4. Update `src/components/layout/footer.tsx`

Keep minimal. Just update copyright text.

### 5. Rewrite `src/App.tsx`

Central orchestrator. Structure:

```typescript
import { useWeddingStore } from "@/hooks/use-wedding-store";
import { WEDDING_STEPS } from "@/data/wedding-steps";
// ... all component imports

function App() {
  const store = useWeddingStore();
  const { state } = store;
  const progress = store.getProgress();

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#2c1810]">
      <Header progressPct={progress.pct} done={progress.done} total={progress.total} />
      <div className="max-w-[920px] mx-auto px-2">
        <StatsGrid
          totalSteps={WEDDING_STEPS.length}
          done={progress.done}
          total={progress.total}
          budget={state.bud}
          progressPct={progress.pct}
        />
        <TabNavigation activeTab={state.tab} onTabChange={store.setTab} />

        {/* Step panels (0-6) */}
        {WEDDING_STEPS.map((step, i) => (
          state.tab === i && (
            <StepPanel
              key={step.id}
              step={step}
              stepIndex={i}
              activeSubTab={state.st[step.id] || 0}
              checkedKeys={state.ck}
              onSubTabChange={(ci) => store.setSubTab(step.id, ci)}
              onToggleCheck={store.toggleCheck}
              onGoAI={(hint) => { /* set AI tab and fill prompt */ }}
            />
          )
        ))}

        {/* Extra panels (7-12) */}
        {state.tab === 7 && <BudgetPanel ... />}
        {state.tab === 8 && <GuestPanel ... />}
        {state.tab === 9 && <CardsPanel ... />}
        {state.tab === 10 && <AiPanel ... />}
        {state.tab === 11 && <PrintPanel ... />}
        {state.tab === 12 && <IdeasPanel />}
      </div>
      <SaveToast visible={...} />
    </div>
  );
}
```

For `onGoAI`: set tab to AI index (WEDDING_STEPS.length + 3 = 10), then use a ref or state to pre-fill the AI textarea.

**Save toast**: trigger briefly after any state change. Use `useEffect` + `setTimeout` on state changes.

### 6. Update `index.html`

Add Google Fonts link before `</head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

### 7. Create `api/ai/chat.ts`

Vercel serverless proxy for ZhipuAI. Accepts POST with `{ prompt, apiKey, budget }`, forwards to ZhipuAI, returns response. This keeps the API key out of browser network logs (optional improvement).

```typescript
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt, apiKey, budget } = await req.json();
    if (!apiKey || !prompt) {
      return Response.json({ error: "Missing apiKey or prompt" }, { status: 400 });
    }

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

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
```

Note: AI panel (Phase 06) calls ZhipuAI directly for now. Can be switched to use this proxy by changing the fetch URL to `/api/ai/chat`.

## Todo List

- [x] Create `src/components/wedding/tab-navigation.tsx`
- [x] Create `src/components/wedding/save-toast.tsx`
- [x] Rewrite `src/components/layout/header.tsx`
- [x] Update `src/components/layout/footer.tsx`
- [x] Rewrite `src/App.tsx`
- [x] Update `index.html` with Google Fonts
- [x] Create `api/ai/chat.ts`
- [x] Run `npm run build` to verify full app compiles
- [ ] Run `npm run dev` and test in browser

## Success Criteria
- App renders with all 13 tabs functional
- Tab switching shows correct panel
- Header shows live progress bar
- Stats grid shows correct values
- Save toast appears briefly on state changes
- Google Fonts load correctly
- `api/ai/chat.ts` handles POST requests
- No TypeScript errors on build

## Risk Assessment
- `App.tsx` may approach 200 lines; if so, extract panel rendering into a `PanelRouter` component
- Save toast timing: use `useRef` for timeout cleanup
- `onGoAI` cross-tab communication: may need a ref for the AI textarea

## Security Considerations
- API proxy (`api/ai/chat.ts`) passes API key from client; in production, key should be env var on server
- Google Fonts loaded from CDN (standard practice)
