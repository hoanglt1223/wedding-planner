# Design Guidelines

## Design Tokens

### Theme System
Wedding Planner uses a dynamic theming system. Four themes available with warm, traditional Vietnamese wedding aesthetics.

**Themes:**
| ID | Name | Primary Color | Use Case |
|----|----|---------|----------|
| `red` | 🔴 Đỏ Truyền Thống | #b91c1c | Traditional red (default) |
| `pink` | 🌸 Hồng Blush | #db2777 | Soft, romantic pink |
| `navy` | 🔵 Xanh Navy | #1e40af | Sophisticated navy blue |
| `sage` | 🌿 Xanh Sage | #15803d | Elegant sage green |

### Color Token Structure
Each theme defines 11 CSS variables applied to `:root`:

| Token | Type | Purpose | Example Value (Red Theme) |
|-------|------|---------|---------|
| `--theme-primary` | hex | Main brand color | #b91c1c |
| `--theme-primary-dark` | hex | Darker variant for hover/active | #8b1a2b |
| `--theme-primary-light` | hex | Light background for callouts | #fef2f2 |
| `--theme-accent` | hex | Secondary highlight color | #c0392b |
| `--theme-surface` | hex | Card/panel background | #FFFBF5 |
| `--theme-surface-muted` | hex | Nested section background | #FFF5EB |
| `--theme-border` | hex | Card border color | #E8DDD0 |
| `--theme-bg` | hex | Page/root background | #FDF8F3 |
| `--theme-note-bg` | hex | Notes callout background | #FEF2F2 |
| `--theme-note-border` | hex | Notes callout border | #FECACA |
| `--theme-note-text` | hex | Notes callout text color | #991B1B |

Theme data defined in `src/data/themes.ts` (AppTheme interface).

### Using Theme Variables in Components

**Inline styles (preferred for dynamic theming):**
```typescript
<div style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }} />
```

**Tailwind arbitrary values:**
```typescript
<div className="bg-[var(--theme-surface)] border-[var(--theme-border)] rounded-lg" />
```

**shadcn Components:**
shadcn Button, Input, and other components automatically use `--primary` and `--primary-foreground` CSS vars set per theme in App.tsx.

## Typography

### Font Scale
- **Base font:** Segoe UI / system-ui / sans-serif
- **2xs:** `text-2xs` utility (0.625rem / 10px) — labels, captions
- **xs:** `text-xs` — secondary text, hints
- **sm:** `text-sm` — body text
- **base:** `text-base` — normal text
- **lg:** `text-lg` — section headers
- **xl:** `text-xl` — panel titles
- **2xl:** `text-2xl` — page titles

### Weight Usage
- **Regular (400):** Body text, descriptions
- **Medium (500):** Button labels, card titles
- **Bold (700):** Page headings, emphasis

## Layout & Spacing

### Border Radius
Applied via CSS var `--radius: 0.625rem` (10px base).

Computed variants in `src/index.css`:
- `rounded-sm` → 6px
- `rounded-md` → 8px
- `rounded-lg` → 10px (base)
- `rounded-xl` → 14px
- `rounded-2xl` → 18px
- `rounded-3xl` → 22px
- `rounded-4xl` → 26px

### Padding & Margins
- **Compact:** 0.5rem (8px)
- **Regular:** 1rem (16px)
- **Spacious:** 1.5rem (24px)
- **Section:** 2rem (32px)

## Component Patterns

### Cards
Unified card pattern uses theme variables:
- Background: `bg-[var(--theme-surface)]`
- Border: `border border-[var(--theme-border)]`
- Corner: `rounded-lg`
- Spacing: `p-4` (standard)
- Shadow: Subtle shadow on hover

### Notes/Callouts
System for highlighted information blocks:
- Background: `bg-[var(--theme-note-bg)]`
- Border: `border-l-4 border-[var(--theme-note-border)]`
- Text: `text-[var(--theme-note-text)]`
- Padding: `p-3` with `pl-4`

### Button States
All buttons via shadcn components use `--primary` override per theme.
- **Default:** background = primary color, text = white
- **Hover:** brightness increased via component styling
- **Active:** darker variant (--theme-primary-dark)
- **Disabled:** muted colors

### Print Styles
Print mode overrides in `src/index.css`:
- Background: white
- Font: 11px
- Borders: 1px solid #ddd
- No shadows
- Ensure checkboxes print clearly with dark borders

## Accessibility

- **Color contrast:** Primary text on surface backgrounds must meet WCAG AA (4.5:1)
- **Focus states:** All interactive elements have ring focus via Tailwind `outline-ring/50`
- **Semantic HTML:** Use `<button>`, `<input>`, `<label>` for form controls
- **ARIA:** Add `aria-label` for icon-only buttons

## Print & Export

Design supports clean printing:
- `.no-print` / `[data-print-hide]` — hide from print
- `.print-show` — show only in print
- `.print-clean` — reset shadows/borders for print
- Print stylesheet forces white background, reduces font size for page density
