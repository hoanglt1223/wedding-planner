# Phase 1: Countdown Timer

## Overview
Add a wedding countdown timer to the header showing days/hours/minutes until the wedding date.

## Files to Create
- `src/lib/countdown.ts` - Countdown calculation utility

## Files to Modify
- `src/components/layout/header.tsx` - Display countdown below progress bar
- `src/App.tsx` - Pass `weddingDate` prop to Header

## Implementation Steps

### 1. Create `src/lib/countdown.ts`
```ts
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  passed: boolean; // true if wedding date has passed
}

export function getCountdown(dateStr: string): CountdownResult | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  if (isNaN(target.getTime())) return null;
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, passed: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { days, hours, minutes, passed: false };
}
```

### 2. Modify `src/App.tsx`
- Pass `weddingDate={state.info.date}` to `<Header />`

### 3. Modify `src/components/layout/header.tsx`
- Import `getCountdown` from `@/lib/countdown`
- Add `weddingDate: string` to HeaderProps
- Use `useState` + `useEffect` with 60s interval to update countdown
- Display countdown below progress stats: "Còn X ngày Y giờ Z phút"
- If wedding passed, show "Chúc mừng ngày cưới!"
- Style: text-white/80, small font, centered

## Success Criteria
- Countdown updates every minute
- Shows correctly for future dates
- Shows celebration message for past dates
- Handles empty/invalid dates gracefully
