---
phase: 6
title: "AI Reading Frontend"
status: pending
priority: P1
effort: 2h
---

# Phase 6: AI Reading Frontend

## Context Links

- [plan.md](./plan.md) | [phase-04](./phase-04-personal-tab-ui.md) | [phase-05](./phase-05-ai-reading-api.md)
- [tab-personal.tsx](../../src/components/astrology/tab-personal.tsx) (created in Phase 4)

## Overview

Add "Xep Chi Tiet" (Detailed Reading) button to the personal tab that calls the AI reading API endpoint. Display loading state, AI response in styled card, and error handling. Button unlocked only when birth date + hour are both provided.

## Key Insights

- Button goes inside `tab-personal.tsx` after the 4 content sections
- API endpoint: POST `/api/astrology-reading` (Phase 5)
- Response: `{ text: string, cached: boolean }` or `{ error: string, message?: string }`
- Rate limit error (429) needs user-friendly message
- Cache AI response in component state (not localStorage) to avoid stale data
- Birth hour required for AI reading — graceful gate with message

## Requirements

### Functional
1. "Xep Chi Tiet" button in personal tab, below existing sections
2. Disabled with helper text if `birthHour` is null
3. Loading spinner while API call in progress
4. AI reading displayed in styled card with markdown-like formatting
5. Error states: rate limited (429), AI unavailable (503), generic error (500)
6. "Cached" indicator when result came from cache

### Non-functional
- Button and card follow existing theme variable pattern
- Under 200 lines for the component
- Accessible: loading state announced

## Architecture

```
tab-personal.tsx
  └── AiReadingCard (birthDate, birthHour, gender, currentYear)
        ├── State: loading, text, error, cached
        ├── fetchReading() → POST /api/astrology-reading
        ├── Button: "🔮 Xếp Chi Tiết" (or disabled message)
        ├── Loading: spinner + "Đang phân tích tử vi..."
        ├── Result: styled card with AI text
        └── Error: error banner with retry option
```

## Related Code Files

### Modify
- `src/components/astrology/tab-personal.tsx` — Import and render AiReadingCard

### Create
- `src/components/astrology/ai-reading-card.tsx` — AI reading button + display component

### Delete
- None

## Implementation Steps

### Step 1: Create ai-reading-card.tsx

File: `src/components/astrology/ai-reading-card.tsx`

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AiReadingCardProps {
  birthDate: string;
  birthHour: number | null;
  gender: string;
  currentYear: number;
}

export function AiReadingCard({ birthDate, birthHour, gender, currentYear }: AiReadingCardProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);

  const hasFullData = birthDate && birthHour !== null;

  const fetchReading = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/astrology-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate, birthHour, gender, currentYear }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.message || "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai.");
        } else if (res.status === 503) {
          setError("Tính năng AI đang bảo trì. Vui lòng thử lại sau.");
        } else {
          setError("Không thể tạo phân tích. Vui lòng thử lại.");
        }
        return;
      }

      setText(data.text);
      setCached(data.cached ?? false);
    } catch {
      setError("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">🔮 Phân Tích Chi Tiết (AI)</h3>

      {!hasFullData && (
        <p className="text-xs text-muted-foreground">
          Nhập đầy đủ ngày sinh và giờ sinh để mở khóa phân tích chi tiết bằng AI.
        </p>
      )}

      {!text && (
        <Button
          onClick={fetchReading}
          disabled={!hasFullData || loading}
          className="w-full"
          variant={hasFullData ? "default" : "outline"}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner /> Đang phân tích tử vi...
            </span>
          ) : (
            "🔮 Xếp Chi Tiết"
          )}
        </Button>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
          <button onClick={fetchReading} className="ml-2 underline text-xs">Thử lại</button>
        </div>
      )}

      {text && (
        <div className="space-y-2">
          <div className="bg-[var(--theme-surface-muted)] rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
          {cached && (
            <p className="text-xs text-muted-foreground text-center">
              📋 Kết quả từ bộ nhớ đệm
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setText(""); setCached(false); }}
            className="w-full text-xs"
          >
            Xếp lại
          </Button>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
```

### Step 2: Integrate into tab-personal.tsx

In `tab-personal.tsx`, after all section components, add:

```typescript
import { AiReadingCard } from "./ai-reading-card";

// Inside TabPersonal return, after ElementDiveSection:
<AiReadingCard
  birthDate={activeProfile === "bride" ? info.brideBirthDate : info.groomBirthDate}
  birthHour={birthHour}
  gender={activeProfile === "bride" ? info.brideGender : info.groomGender}
  currentYear={new Date().getFullYear()}
/>
```

### Step 3: Handle "Xep lai" (re-read) behavior

The "Xep lai" button clears the text state, allowing user to re-fetch. On re-fetch:
- If Redis cache still has the response, returns cached version instantly
- If cache expired or different params, generates new reading
- Rate limit still counts against the daily quota

### Step 4: Handle API URL for development vs production

Vite dev server proxying: The fetch URL `/api/astrology-reading` works in production (Vercel). For local dev, configure Vite proxy in `vite.config.ts` if needed, or test directly against deployed API.

If Vite proxy needed:
```typescript
// vite.config.ts — server.proxy (only if local API testing needed)
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

However, since Vercel CLI (`vercel dev`) serves both frontend and API, this may not be needed.

## Todo List

- [ ] Create `src/components/astrology/ai-reading-card.tsx`
- [ ] Implement fetch with loading/error/success states
- [ ] Handle 429 (rate limit), 503 (unavailable), generic errors
- [ ] Add "Xep lai" button to re-fetch
- [ ] Integrate into `tab-personal.tsx`
- [ ] Test with birth date + hour provided (button enabled)
- [ ] Test with birth hour = null (button disabled with message)
- [ ] Test rate limiting: verify 429 error display
- [ ] Verify component under 200 lines
- [ ] Run `npm run build`

## Success Criteria

- Button disabled when `birthHour` is null, with explanation text
- Button triggers API call with loading spinner
- AI reading text displays in styled card
- Rate limit error shows Vietnamese message
- "Xep lai" clears text and allows re-fetch
- Cached indicator shows when result is from cache

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slow API response makes loading feel broken | Medium | Show spinner + "Dang phan tich..." text; consider timeout after 15s |
| User spams button before response arrives | Low | Disable button during loading state |
| API not deployed yet during development | Low | Button returns error gracefully; test with deployed API |

## Security Considerations

- No sensitive data sent to API (birth date/hour/gender only)
- CORS handled server-side
- No API key exposed to client

## Next Steps

- Deploy API endpoint (Phase 5) before testing this frontend component
- End-to-end test: form input -> personal tab -> AI reading flow
