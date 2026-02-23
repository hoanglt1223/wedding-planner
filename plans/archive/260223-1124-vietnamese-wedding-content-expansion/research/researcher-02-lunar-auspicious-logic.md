# Research Report: Vietnamese Auspicious Date Calculation Logic

**Date:** 2026-02-23
**Scope:** Algorithms for Hoàng Đạo/Hắc Đạo, Tam Nương, Can Chi, Ngũ Hành, `@dqcai/vn-lunar` API

---

## 1. Hoàng Đạo / Hắc Đạo System

### 1a. The 12 Daily Cycles (12 Thần)

Each lunar day is assigned one of 12 "celestial officials" cycling in order:

| # | Name | Type |
|---|------|------|
| 0 | Thanh Long (青龍) | **Hoàng Đạo** ✓ |
| 1 | Minh Đường (明堂) | **Hoàng Đạo** ✓ |
| 2 | Thiên Hình (天刑) | Hắc Đạo ✗ |
| 3 | Chu Tước (朱雀) | Hắc Đạo ✗ |
| 4 | Kim Quỹ (金匱) | **Hoàng Đạo** ✓ |
| 5 | Bảo Quang (寶光) | **Hoàng Đạo** ✓ |
| 6 | Bạch Hổ (白虎) | Hắc Đạo ✗ |
| 7 | Ngọc Đường (玉堂) | **Hoàng Đạo** ✓ |
| 8 | Thiên Lao (天牢) | Hắc Đạo ✗ |
| 9 | Nguyên Vũ (玄武) | Hắc Đạo ✗ |
| 10 | Tư Mệnh (司命) | **Hoàng Đạo** ✓ |
| 11 | Câu Trần (勾陳) | Hắc Đạo ✗ |

6 Hoàng Đạo: indices 0,1,4,5,7,10
6 Hắc Đạo: indices 2,3,6,8,9,11

### 1b. Mapping Formula

The cycle starting index for a given lunar month is determined by the month's Earthly Branch (Chi). Since lunar months 1–12 map to Chi indices starting at Dần (index 2):

```
// lunarMonth: 1–12
// startIndex for month's Thanh Long:
// Month 1 → Tý (Chi 0), Month 2 → Dần (Chi 2), etc.
// Standard lookup table (month → starting Chi of Thanh Long):

MONTH_START_CHI = [0, 2, 4, 6, 8, 10, 0, 2, 4, 6, 8, 10]
// index 0 = month 1, repeats every 6 months

// To find which of the 12 Thần applies to a day:
dayChiIndex = (lunarDay - 1) % 12        // Chi of that day (Tý=0..Hợi=11)
monthOffset = MONTH_START_CHI[lunarMonth - 1]
thanIndex = (dayChiIndex - monthOffset + 12) % 12
isHoangDao = [0,1,4,5,7,10].includes(thanIndex)
```

**Auspicious Chi by month (Hoàng Đạo days):**

| Months | Hoàng Đạo Chi (day branch) |
|--------|---------------------------|
| 1 & 7 | Tý, Sửu, Tỵ, Mùi |
| 2 & 8 | Dần, Mão, Mùi, Dậu |
| 3 & 9 | Thìn, Tỵ, Dậu, Hợi |
| 4 & 10 | Ngọ, Mùi, Sửu, Dậu |
| 5 & 11 | Thân, Dậu, Sửu, Mão |
| 6 & 12 | Tuất, Hợi, Mão, Tỵ |

**Implementation approach:** Get the day's Chi from `getDayCanChi()` (last character), look up in the month's Hoàng Đạo Chi set.

---

## 2. Tam Nương Days (Ngày Tam Nương)

**Fixed lunar dates to avoid:**
`[3, 7, 13, 18, 22, 27]`

```typescript
const TAM_NUONG_DAYS = new Set([3, 7, 13, 18, 22, 27]);
const isTamNuong = (lunarDay: number) => TAM_NUONG_DAYS.has(lunarDay);
```

These are considered "3 ladies" (Tam Nương) days — inauspicious for weddings, travel, major events. No formula needed — pure lookup.

---

## 3. Other Avoidance Days

### Sát Chủ (Ngày Sát Chủ)
Based on day-of-week + lunar day combination. Less universally standardized; often omitted in modern apps in favor of Tam Nương + Hoàng Đạo checks.

### Additional common avoidances:
- **Ngày Nguyệt Kỵ**: 5th, 14th, 23rd of each lunar month
- **Ngày Dương Công Kỵ**: 13 fixed days across the year (e.g., 1/1, 11/1, 9/2…)
- **Ngày Hắc Đạo**: Covered above

For weddings, priority check order: Tam Nương → Nguyệt Kỵ → Hắc Đạo → Sát Chủ

---

## 4. Can Chi (Heavenly Stems + Earthly Branches)

### 10 Thiên Can (Heavenly Stems)
```
Index: 0     1    2      3      4     5    6     7     8     9
Name:  Giáp  Ất   Bính   Đinh   Mậu   Kỷ   Canh  Tân   Nhâm  Quý
```

### 12 Địa Chi (Earthly Branches)
```
Index: 0   1     2     3    4     5    6    7    8     9    10    11
Name:  Tý  Sửu  Dần   Mão  Thìn  Tỵ   Ngọ  Mùi  Thân  Dậu  Tuất  Hợi
```

### Can Chi Calculation (from `@dqcai/vn-lunar` source)

**Year Can Chi:**
```typescript
function getYearCanChi(lunarYear: number): string {
  const canIndex = (lunarYear + 6) % 10;
  const chiIndex = (lunarYear + 8) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}
```

**Day Can Chi** (from Julian Day Number):
```typescript
function getDayCanChi(jd: number): string {
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}
```

**Month Can Chi:**
```typescript
function getMonthCanChi(lunarMonth: number, lunarYear: number): string {
  const canIndex = ((lunarYear + 6) % 10 * 2 + lunarMonth) % 10;
  const chiIndex = (lunarMonth + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}
```

---

## 5. Ngũ Hành (Five Elements) for Wedding Compatibility

### Element Assignment by Year's Thiên Can

| Can | Element (Hành) |
|-----|---------------|
| Giáp, Ất | Mộc (Wood) |
| Bính, Đinh | Hỏa (Fire) |
| Mậu, Kỷ | Thổ (Earth) |
| Canh, Tân | Kim (Metal) |
| Nhâm, Quý | Thủy (Water) |

```typescript
const NAM_HANH = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];
// canIndex = (year + 6) % 10
const element = NAM_HANH[canIndex];
```

### Generation Cycle (Tương Sinh — favorable):
```
Mộc → Hỏa → Thổ → Kim → Thủy → Mộc
```

### Destruction Cycle (Tương Khắc — unfavorable):
```
Mộc → Thổ → Thủy → Hỏa → Kim → Mộc
```

### Compatibility Matrix

| Bride \ Groom | Mộc | Hỏa | Thổ | Kim | Thủy |
|---------------|-----|-----|-----|-----|------|
| **Mộc** | ✓ neutral | ✓ sinh | ✗ khắc | ✗ bị khắc | ✓ được sinh |
| **Hỏa** | ✓ được sinh | ✓ neutral | ✓ sinh | ✗ khắc | ✗ bị khắc |
| **Thổ** | ✗ bị khắc | ✓ được sinh | ✓ neutral | ✓ sinh | ✗ khắc |
| **Kim** | ✗ khắc | ✗ bị khắc | ✓ được sinh | ✓ neutral | ✓ sinh |
| **Thủy** | ✓ sinh | ✗ khắc | ✗ bị khắc | ✓ được sinh | ✓ neutral |

**Wedding date element** should ideally Sinh (generate) or be neutral with both partners' elements.

---

## 6. `@dqcai/vn-lunar` Package API

**Package:** `@dqcai/vn-lunar@1.0.1` (MIT, no deps, 281KB unpacked)
**Supported range:** 1200–2199 CE, timezone: UTC+7

### Exported Functions

```typescript
// Convert solar → lunar
getLunarDate(day: number, month: number, year: number): LunarDate
// Returns: { day, month, year, leap: boolean, jd: number }

// Convert lunar → solar
getSolarDate(day: number, month: number, year: number, leap?: boolean): SolarDateInfo
// Returns: { day, month, year, jd: number }

// Can Chi strings
getYearCanChi(lunarYear: number): string          // e.g. "Bính Ngọ"
getDayCanChi(jd: number): string                  // e.g. "Canh Tý"
getMonthCanChi(lunarMonth: number, lunarYear: number): string

// Year data (all month start dates for a year)
getYearInfo(year: number): LunarDate[]
decodeLunarYear(year: number, k: number): LunarDate[]
```

### LunarCalendar Class

```typescript
class LunarCalendar {
  static fromSolar(day, month, year): LunarCalendar
  static fromLunar(day, month, year, leap?): LunarCalendar
  static today(): LunarCalendar

  get lunarDate(): LunarDate         // { day, month, year, leap, jd }
  get solarDate(): SolarDateInfo     // { day, month, year, jd }
  get yearCanChi(): string
  get dayCanChi(): string
  get monthCanChi(): string
  get dayOfWeek(): string            // Vietnamese: "Thứ hai"..
  formatLunar(): string
  formatSolar(): string
}
```

### Exported Constants

```typescript
CAN: string[]     // 10 Heavenly Stems
CHI: string[]     // 12 Earthly Branches
GIO_HD: string[]  // 6 lucky hour patterns (binary strings per day type)
TIET_KHI: string[] // 24 solar terms
TK13..TK22: number[] // Precomputed year lookup tables per century
```

### GIO_HD — Lucky Hours Pattern

`GIO_HD` is an array of 6 binary strings (12 chars each), indexed by `(dayCanChiIndex % 6)`:

```typescript
GIO_HD = [
  "110100101100",  // day type 0
  "001101001011",  // day type 1
  "110011010010",  // day type 2
  "101100110100",  // day type 3
  "001011001101",  // day type 4
  "010010110011",  // day type 5
]
// char[i] = '1' means hour i (Tý=0..Hợi=11) is auspicious
```

### Usage Example

```typescript
import { LunarCalendar, getLunarDate, getYearCanChi } from '@dqcai/vn-lunar';

const cal = LunarCalendar.fromSolar(15, 6, 2026);
console.log(cal.lunarDate);    // { day: 21, month: 5, year: 2026, leap: false, jd: ... }
console.log(cal.dayCanChi);    // "Giáp Tý"
console.log(cal.yearCanChi);   // "Bính Ngọ"
```

---

## Implementation Notes

1. **Hoàng Đạo check**: Extract Chi from `getDayCanChi()` result (last word), look up in month's allowed set
2. **Tam Nương check**: `lunarDay % 30` in `[3,7,13,18,22,27]`
3. **Element**: Derive from `(lunarYear + 6) % 10` → NAM_HANH lookup
4. **No built-in auspicious-day API** in `@dqcai/vn-lunar` — must implement checks manually using exported Can/Chi data

---

## Unresolved Questions

1. **Sát Chủ exact formula** — multiple conflicting definitions found; not algorithmically pinned
2. **Dương Công Kỵ dates** — the 13 avoidance dates need Vietnamese almanac source confirmation
3. **Hoàng Đạo hour calculation** — `GIO_HD` uses day Chi index mod 6; exact mapping of `dayCanChiIndex` to the 6 patterns not confirmed from authoritative source

---

## Sources

- [@dqcai/vn-lunar npm](https://www.npmjs.com/package/@dqcai/vn-lunar) — package source (inspected `/lib/index.mjs`)
- [imuabanbds.vn — Ngày Hoàng Đạo/Hắc Đạo](https://imuabanbds.vn/phong-thuy/ngay-hoang-dao-ngay-hac-dao-gio-hoang-dao-gio-hac-dao-la-gi-35088.html)
- [Saigoneer — Tam Nương legends](https://saigoneer.com/saigon-culture/12650-the-legends-of-tam-n%C6%B0%C6%A1ng-and-why-you-shouldn-t-start-a-business-on-the-7th-day-of-tet)
- [Ho Ngoc Duc's algorithm](https://www.xemamlich.uhm.vn/calrules_en.html)
- [github.com/tiendat77/vietnamese-lunar-calendar](https://github.com/tiendat77/vietnamese-lunar-calendar)
