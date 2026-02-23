# Phase 04: Family Roles & Etiquette Guide

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 01](phase-01-foundation-region-types.md)
- Research: [Wedding customs](research/researcher-01-wedding-customs.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Est:** 4h
- **Description:** Role cards showing family members' responsibilities per ceremony phase, plus etiquette tips for dress code, speech order, seating, and gift-giving.

## Key Insights
- Existing `Person` type in ceremonies has `name`, `role`, `avatar` — too flat for detailed responsibilities
- New `FamilyRole` type: links role to multiple phases with phase-specific duties
- Key roles from research: Ông Mai/Bà Mai, đại diện nhà trai/gái, MC, bố mẹ hai bên, phù rể/phù dâu
- Etiquette is mostly universal with minor regional nuances (dress code in Central differs most)
- UI: Role cards with expandable per-phase duties, plus an etiquette quick-reference section

## Requirements

### Functional
- Role cards: avatar + name + description + per-phase duties (expandable)
- Etiquette sections: dress code, speech order, seating, tea ceremony, gift-giving
- Regional dress code variation (North/Central/South)
- Bilingual content (VI + EN)

### Non-Functional
- Data organized in `src/data/family-roles/`
- Roles accessible from each step panel (context-relevant)
- Max 200 lines per file

## Architecture

### Data Structure
```typescript
// src/data/family-roles/roles.ts
export const FAMILY_ROLES: FamilyRole[] = [
  {
    id: "matchmaker",
    name: "Ông Mai / Bà Mai",
    vietnameseName: "Ông Mai / Bà Mai",
    description: "Người mai mối, giới thiệu hai gia đình...",
    avatar: "🤝",
    responsibilities: {
      engagement: ["Giới thiệu hai gia đình", "Có mặt tại lễ dạm ngõ"],
      betrothal: ["Nhận trà đầu tiên từ chú rể", "Chứng kiến trao sính lễ"],
      wedding: ["Chứng kiến lễ cưới", "Nhận trà trong lễ rót trà"],
    },
  },
  // ...
];

// src/data/family-roles/etiquette.ts
export interface EtiquetteRule {
  id: string;
  title: string;
  icon: string;
  content: string;
  regionalNotes?: RegionalContent<string>;
}

export const ETIQUETTE_RULES: EtiquetteRule[] = [
  {
    id: "dress-code",
    title: "Trang phục",
    icon: "👗",
    content: "Cô dâu mặc áo dài đỏ/hồng ngày đám hỏi, trắng ngày cưới...",
    regionalNotes: {
      default: "",
      central: "Huế: áo Nhật Bình cho cô dâu, thêu phượng...",
    },
  },
  // ...
];
```

### Data File Organization
```
src/data/family-roles/
├── index.ts           # getFamilyRoles(lang), getEtiquetteRules(lang, region)
├── roles.ts           # Vietnamese role definitions
├── roles.en.ts        # English translations
├── etiquette.ts       # Vietnamese etiquette rules
└── etiquette.en.ts    # English translations
```

### UI Components
```
FamilyRolesPanel (new section in step view)
├── Section header: "👪 Vai trò gia đình"
├── RoleCard (for each role relevant to current phase)
│   ├── Avatar + Name + Description
│   └── Expandable: phase-specific duties
└── EtiquetteSection
    ├── Section header: "📋 Nghi thức & Lễ phép"
    └── EtiquetteCard (for each rule)
        ├── Icon + Title + Content
        └── Regional note (if applicable)
```

## Related Code Files

### Modify
- `src/components/wedding/ceremony-section.tsx` or `step-panel.tsx` — Add roles panel section
- `src/data/resolve-data.ts` — Add `getFamilyRoles(lang)`, `getEtiquetteRules(lang, region)`
- `src/lib/i18n-translations.ts` — Add ~10 keys

### Create
- `src/data/family-roles/index.ts`
- `src/data/family-roles/roles.ts` + `roles.en.ts`
- `src/data/family-roles/etiquette.ts` + `etiquette.en.ts`
- `src/components/wedding/family-roles-panel.tsx` — Role cards + etiquette section

## Implementation Steps

1. Create `src/data/family-roles/roles.ts` with 7 core roles:
   - Ông Mai/Bà Mai (matchmaker)
   - Đại diện nhà trai (groom's representative)
   - Đại diện nhà gái (bride's representative)
   - MC (master of ceremonies)
   - Bố mẹ chú rể (groom's parents)
   - Bố mẹ cô dâu (bride's parents)
   - Phù rể/Phù dâu (best man/maid of honor + gift bearers)

2. Create `src/data/family-roles/etiquette.ts` with 5 etiquette rules:
   - Dress code (regional variations for áo dài styles)
   - Speech order (who speaks when)
   - Seating arrangement (groom's left, bride's right, elders front)
   - Tea ceremony procedure (order of serving)
   - Gift-giving protocol (red envelopes, jewelry timing)

3. Create English translations: `roles.en.ts`, `etiquette.en.ts`

4. Create `src/data/family-roles/index.ts` — resolver functions

5. Create `src/components/wedding/family-roles-panel.tsx`:
   - Filter roles by current phase
   - Render role cards with expandable duties
   - Render etiquette rules with regional notes
   - Collapsible section (like Phase 2's collapsible-detail)

6. Integrate into step views — show after ceremony details, before notes

7. Add i18n keys

8. Build check

## Roles × Phases Matrix

| Role | Dạm Ngõ | Ăn Hỏi | Xin Dâu | Cưới | Rước Dâu | Sau Cưới |
|------|---------|---------|---------|------|----------|----------|
| Ông Mai/Bà Mai | ✓ | ✓ | — | ✓ | — | — |
| Đại diện nhà trai | ✓ | ✓ | — | ✓ | ✓ | — |
| Đại diện nhà gái | ✓ | ✓ | — | ✓ | — | — |
| MC | — | ✓ | — | ✓ | ✓ | — |
| Bố mẹ chú rể | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Bố mẹ cô dâu | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Phù rể/dâu | — | ✓ | — | ✓ | ✓ | — |

## Todo List
- [x] Create `roles.ts` with 7 roles + per-phase duties
- [x] Create `roles.en.ts`
- [x] Create `etiquette.ts` with 5 rules + regional notes
- [x] Create `etiquette.en.ts`
- [x] Create `family-roles/index.ts` resolver
- [x] Add getters to `resolve-data.ts`
- [x] Create `family-roles-panel.tsx` component
- [ ] Integrate into step views (Phase 6)
- [x] Add i18n keys (already present in translations file)
- [x] Build check passes

## Success Criteria
- [ ] Role cards show for relevant phases only
- [ ] Phase-specific duties expand/collapse
- [ ] Etiquette rules display with regional notes when applicable
- [ ] Content bilingual (VI + EN)
- [ ] No file exceeds 200 lines

## Risk Assessment
- **Content accuracy**: MEDIUM — Roles are well-documented in Vietnamese culture
- **UI complexity**: LOW — Card-based, reuses existing patterns
- **Role-phase mapping**: LOW — Clear matrix defined above

## Security Considerations
- Static content only

## Next Steps
- Future: Interactive "who does what" checklist (assign actual family members to roles)
- Future: Role assignment sharing between couple and families
