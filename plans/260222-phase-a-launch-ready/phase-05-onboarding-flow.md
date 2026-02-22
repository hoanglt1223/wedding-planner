# Phase 05: Onboarding Flow

## Context Links
- [Parent Plan](./plan.md)
- [Mobile UX Research](./research/researcher-02-mobile-ux-and-landing.md)
- [Current Default State](../../src/data/backgrounds.ts) -- `DEFAULT_STATE` lines 73-105

## Overview
- **Date:** 2026-02-22
- **Priority:** P1
- **Status:** pending
- **Effort:** 4h
- **Description:** Replace pre-filled example data ("Nguyen Thi A", "Tran Van B") with a 3-step onboarding wizard. Show value within 30 seconds. Store `onboardingComplete` flag in localStorage.

## Key Insights
- Current DEFAULT_STATE has fake names ("Nguyen Thi A", "Tran Van B") and a hardcoded date (2025-12-20). New users see someone else's wedding.
- Progressive disclosure: collect minimal info first, let users discover features organically.
- 3 steps: (1) Names + date, (2) Preview ceremony timeline, (3) Enter dashboard.
- Demo mode: user can skip onboarding and explore with example data (explicit opt-in).
- Must feel fast. No loading spinners. Instant transitions between steps.

## Requirements
**Functional:**
- New visitors (no localStorage data) see onboarding wizard
- Returning visitors (have localStorage data) skip directly to dashboard
- Step 1: Couple names (bride + groom) + wedding date (required)
- Step 2: Quick ceremony preview (read-only, shows 8-step summary)
- Step 3: "Start Planning" button enters dashboard with user's data
- Skip button: "Xem thu" (Try Demo) loads example data and skips to dashboard

**Non-functional:**
- Wizard under 150 lines total (split into 2 files max)
- Transitions feel instant (no API calls)
- Mobile-first layout

## Architecture
```
WeddingState gains: onboardingComplete: boolean

src/components/onboarding/
  onboarding-wizard.tsx   (new, ~100 lines, 3-step wizard)
  onboarding-preview.tsx  (new, ~60 lines, ceremony timeline preview)

App.tsx renders:
  onboardingComplete === false ──> OnboardingWizard
  onboardingComplete === true  ──> existing PageRouter
```

## Related Code Files
**Modify:**
- `src/types/wedding.ts` -- add `onboardingComplete: boolean` to WeddingState
- `src/data/backgrounds.ts` -- change DEFAULT_STATE: empty names/dates, `onboardingComplete: false`
- `src/hooks/use-wedding-store.ts` -- add `completeOnboarding()` action
- `src/App.tsx` -- conditionally render OnboardingWizard or PageRouter
- `src/lib/migrate-state.ts` -- add migration to set `onboardingComplete: true` for existing users (they already have data)

**Create:**
- `src/components/onboarding/onboarding-wizard.tsx`
- `src/components/onboarding/onboarding-preview.tsx`

## Implementation Steps

1. **Update WeddingState type (wedding.ts line 94):** Add `onboardingComplete: boolean;` after `stepStartTimes`.

2. **Update DEFAULT_STATE (backgrounds.ts lines 84-93):** Change info to empty strings:
   ```ts
   info: {
     bride: "", groom: "",
     brideFamilyName: "", groomFamilyName: "",
     date: "", engagementDate: "", betrothalDate: "",
     brideBirthYear: "", groomBirthYear: "",
   },
   ```
   Add `onboardingComplete: false` to DEFAULT_STATE.

3. **Add migration (migrate-state.ts):** Check if existing `wp_v11` data lacks `onboardingComplete`. If data exists and has a non-empty `info.bride`, set `onboardingComplete: true`. This ensures returning users aren't forced through onboarding.

4. **Add store action (use-wedding-store.ts):** Add `completeOnboarding` callback:
   ```ts
   const completeOnboarding = useCallback(() => {
     setState(prev => ({ ...prev, onboardingComplete: true }));
   }, [setState]);
   ```
   Add to return object.

5. **Create onboarding-preview.tsx:** Shows the 8 wedding steps as a compact vertical timeline. Import `WEDDING_STEPS` from data. Map to a list: icon + title + timeline string. Read-only, no checkboxes. Max 60 lines.

6. **Create onboarding-wizard.tsx:** 3-step wizard component.
   - State: `step` (0, 1, 2)
   - Step 0: Two Input fields (bride name, groom name) + date picker + "Tiep tuc" (Continue) button. Validate: both names required.
   - Step 1: Render `<OnboardingPreview />`. "Tiep tuc" button.
   - Step 2: Summary card showing entered info + "Bat Dau Len Ke Hoach!" (Start Planning) button. Calls `store.updateInfo()` for each field, then `store.completeOnboarding()`.
   - Skip link at bottom: "Xem thu voi du lieu mau" (Try with sample data). Loads example data (current hardcoded values), sets `onboardingComplete: true`.

7. **Update App.tsx:** Before `<PageRouter>`, check `state.onboardingComplete`:
   ```tsx
   {!state.onboardingComplete ? (
     <OnboardingWizard store={store} />
   ) : (
     <>
       <Navbar ... />
       <div className="max-w-[920px] mx-auto px-3 sm:px-2 pt-2">
         <PageRouter ... />
       </div>
       <Footer ... />
     </>
   )}
   ```
   Hide Navbar/Footer during onboarding for cleaner experience.

8. **Build & test:** Verify new users see wizard. Verify existing users (with localStorage data) skip to dashboard. Test "skip/demo" flow.

## Todo List
- [ ] Add onboardingComplete to WeddingState type
- [ ] Update DEFAULT_STATE with empty info + onboardingComplete: false
- [ ] Add migration for existing users
- [ ] Add completeOnboarding action to store
- [ ] Create onboarding-preview.tsx
- [ ] Create onboarding-wizard.tsx (3 steps)
- [ ] Update App.tsx to conditionally render wizard
- [ ] Test new user flow (empty localStorage)
- [ ] Test returning user flow (existing localStorage)
- [ ] Test skip/demo mode
- [ ] Verify build passes

## Success Criteria
- New users see onboarding wizard, not fake data
- Onboarding completes in <30 seconds
- Returning users bypass onboarding entirely
- Demo mode loads example data correctly
- All 3 steps work on 375px mobile viewport

## Risk Assessment
- **Medium:** localStorage migration must handle edge cases (corrupted data, partial state). Mitigation: migration checks for key existence before setting flag.
- **Low:** Changing DEFAULT_STATE may break existing unit tests. Mitigation: no tests exist currently.

## Security Considerations
- No data sent to server. All onboarding data stays in localStorage.
- Input sanitization: trim whitespace on names before storing.

## Next Steps
Phase 06 (Zodiac Card) and Phase 07 (Share Link) are independent and can proceed in parallel.
