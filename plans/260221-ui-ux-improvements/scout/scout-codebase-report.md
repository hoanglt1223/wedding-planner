# Scout Report — UI/UX Layout & Component Inventory

## Key Files for UI/UX Changes

### Layout Layer (header/nav/footer)
| File | Lines | Purpose |
|---|---|---|
| `src/App.tsx` | 72 | Root shell, theme, layout orchestration |
| `src/components/layout/topbar.tsx` | 33 | Sticky page nav (6 pages), pill buttons |
| `src/components/layout/header.tsx` | 54 | Gradient header, progress bar, countdown, reminders |
| `src/components/layout/footer.tsx` | 32 | Theme picker + lang toggle |
| `src/components/layout/scrollable-tab-bar.tsx` | 116 | Reusable scroll tabs (pill/box variants) |
| `src/components/layout/theme-picker.tsx` | 49 | Dropdown color theme selector |
| `src/components/layout/reminders.tsx` | 86 | Urgency milestone chips |

### Page Layer
| File | Lines | Purpose |
|---|---|---|
| `src/pages/page-router.tsx` | 81 | Top-level page switch |
| `src/pages/planning-page.tsx` | 29 | Planning: StatsGrid + TabNav + PanelRouter |
| `src/pages/astrology-page.tsx` | 112 | Tu-vi with 5 sub-tabs (uses purple, inconsistent) |

### Planning Sub-tabs
| File | Lines | Purpose |
|---|---|---|
| `src/components/wedding/panel-router.tsx` | 86 | Routes tabs 0-10 |
| `src/components/wedding/tab-navigation.tsx` | 24 | ScrollableTabBar wrapper (box variant) |
| `src/components/wedding/stats-grid.tsx` | 32 | 4-stat cards |
| `src/components/wedding/step-panel.tsx` | 121 | Wedding step detail |

### Feature Panels (need empty states)
| File | Lines | Purpose |
|---|---|---|
| `src/components/budget/budget-panel.tsx` | 121 | Budget input + categories |
| `src/components/guests/guest-panel.tsx` | 179 | Guest CRUD + seating |
| `src/components/notes/notes-panel.tsx` | 30 | Textarea notepad |
| `src/components/vendors/vendor-panel.tsx` | 125 | Vendor contacts |

### Cards Page (needs card overflow fix)
| File | Lines | Purpose |
|---|---|---|
| `src/components/cards/cards-panel.tsx` | 101 | Cards page composition |
| `src/components/cards/background-grid.tsx` | 63 | 10 background previews |
| `src/components/cards/invitation-grid.tsx` | 96 | 10 invitation previews |

## Styling Inconsistencies Found
- `astrology-page.tsx` uses `bg-purple-700` for tabs (rest of app uses `bg-red-700`)
- Budget uses hardcoded `text-[#c0392b]` instead of Tailwind `text-red-700`
- Cards sections use `bg-white/5` (transparent) vs `<Card>` (white) elsewhere
- AI page: `bg-gradient-to-b from-slate-900 to-slate-800` (dark)
- Ideas page: `bg-gradient-to-b from-purple-950 to-slate-900` (dark purple)
- Planning/Cards/Handbook: white/cream bg
