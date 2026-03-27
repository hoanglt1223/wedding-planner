# Phase 1: Gio Hoang Dao Logic

## Context
- [hoang-dao.ts](../../src/data/auspicious/hoang-dao.ts) — existing day-level Hoang Dao calc
- Same principle applies to hours: 12 two-hour periods cycle through 12 celestial officials

## Overview
- **Priority:** P1 (blocks Phase 4 detail panel)
- **Status:** pending
- Create `src/data/auspicious/gio-hoang-dao.ts` — pure function calculating auspicious hours for a given day

## Key Insights

Gio Hoang Dao follows the same HOANG_DAO_INDICES pattern as day-level but keyed on the **day's Chi** instead of month's Chi. The starting Chi for Thanh Long hour varies by day Chi:

| Day Chi | Thanh Long starts at |
|---------|---------------------|
| Ty, Ngo | Ty (23-01) |
| Suu, Mui | Dan (03-05) |
| Dan, Than | Thin (07-09) |
| Mao, Dau | Ngo (11-13) |
| Thin, Tuat | Than (15-17) |
| Ty, Hoi | Tuat (19-21) |

Mapping: dayChiIndex % 6 → startChiIndex: [0, 2, 4, 6, 8, 10]

## Requirements

### Functional
- `getHoangDaoHours(dayChiIndex: number): HoangDaoHour[]` — returns all 12 periods with auspicious flag
- Each `HoangDaoHour`: `{ chiIndex, chiName, startHour, endHour, isHoangDao, celestialName }`
- Filter helper: `getAuspiciousHours(dayChiIndex: number): HoangDaoHour[]` — only Hoang Dao ones

### Non-functional
- Pure functions, no side effects
- <80 lines

## Architecture

Reuses `HOANG_DAO_INDICES` and `CELESTIAL_NAMES` from `hoang-dao.ts` (import them).

## Related Code Files
- **Create:** `src/data/auspicious/gio-hoang-dao.ts`
- **Modify:** `src/data/auspicious/index.ts` (re-export)

## Implementation Steps

1. Create `src/data/auspicious/gio-hoang-dao.ts`
2. Define `HoangDaoHour` interface
3. Define `CHI_NAMES` array: ["Ty", "Suu", "Dan", "Mao", "Thin", "Ty", "Ngo", "Mui", "Than", "Dau", "Tuat", "Hoi"]
4. Define `HOUR_RANGES`: [{start: 23, end: 1}, {start: 1, end: 3}, ...] for 12 periods
5. Compute: `startChiForThanhLong = (dayChiIndex % 6) * 2` — this maps each pair to the correct start
6. For each of 12 hour periods, compute celestial index = `(hourChiIndex - startChiForThanhLong + 12) % 12`, check if in HOANG_DAO_INDICES
7. Export `getHoangDaoHours()` and `getAuspiciousHours()`
8. Add re-exports to `index.ts`

## Todo
- [ ] Create gio-hoang-dao.ts with HoangDaoHour type
- [ ] Implement getHoangDaoHours using day Chi
- [ ] Implement getAuspiciousHours filter
- [ ] Re-export from index.ts

## Success Criteria
- `getAuspiciousHours(0)` (Ty day) returns exactly 6 hours
- Hours match traditional Hoang Dao hour tables
- File <80 lines

## Risk Assessment
- **Low risk** — well-defined algorithm, same pattern as existing day-level code
- Verify the day Chi → Thanh Long start mapping against authoritative sources
