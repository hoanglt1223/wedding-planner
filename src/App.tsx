import { useEffect, useRef, useState } from "react";
import { useWeddingStore } from "@/hooks/use-wedding-store";
import { useUserId } from "@/hooks/use-user-id";
import { useSync } from "@/hooks/use-sync";
import { useTracking } from "@/hooks/use-tracking";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Navbar } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Footer } from "@/components/layout/footer";
import { SaveToast } from "@/components/wedding/save-toast";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { PageRouter } from "@/pages/page-router";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

function App() {
  const store = useWeddingStore();
  const { state } = store;
  const progress = store.getProgress();

  const userId = useUserId();
  useSync({ userId, state, progress: progress.pct });
  const { track } = useTracking(userId);

  const isOnline = useOnlineStatus();
  const theme = THEMES.find((t) => t.id === (state.themeId || DEFAULT_THEME_ID)) || THEMES[0];

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mountRef = useRef(false);
  const trackMountRef = useRef(false);

  // Show brief save toast on state changes (skip initial mount)
  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
      return;
    }
    setShowSave(true); // eslint-disable-line react-hooks/set-state-in-effect
    timerRef.current = setTimeout(() => setShowSave(false), 1200);
    return () => clearTimeout(timerRef.current);
  }, [state]);

  // Track state-change events
  const prevSnap = useRef({
    page: state.page, lang: state.lang, region: state.region, themeId: state.themeId,
    budget: state.budget, guestCount: state.guests.length, onboarded: state.onboardingComplete,
    weddingDate: state.info.date, groomName: state.info.groom, brideName: state.info.bride,
    groomBirthDate: state.info.groomBirthDate, brideBirthDate: state.info.brideBirthDate,
  });
  useEffect(() => {
    if (!trackMountRef.current) { trackMountRef.current = true; return; }
    const prev = prevSnap.current;
    if (state.page !== prev.page) track("page_view", { page: state.page });
    if (state.lang !== prev.lang) track("lang_change", { lang: state.lang });
    if (state.region !== prev.region) track("region_change", { region: state.region });
    if (state.themeId !== prev.themeId) track("theme_change", { themeId: state.themeId });
    if (state.budget !== prev.budget) track("budget_set", { budget: state.budget });
    if (state.guests.length !== prev.guestCount) track("guest_count_change", { count: state.guests.length });
    if (state.onboardingComplete && !prev.onboarded) track("onboarding_complete", { region: state.region, lang: state.lang });
    if (state.info.date !== prev.weddingDate) track("wedding_date_set", { date: state.info.date });
    if (state.info.groom !== prev.groomName) track("groom_name_set", { name: state.info.groom });
    if (state.info.bride !== prev.brideName) track("bride_name_set", { name: state.info.bride });
    if (state.info.groomBirthDate !== prev.groomBirthDate) track("groom_birth_date_set", { date: state.info.groomBirthDate });
    if (state.info.brideBirthDate !== prev.brideBirthDate) track("bride_birth_date_set", { date: state.info.brideBirthDate });
    prevSnap.current = {
      page: state.page, lang: state.lang, region: state.region, themeId: state.themeId,
      budget: state.budget, guestCount: state.guests.length, onboarded: state.onboardingComplete,
      weddingDate: state.info.date, groomName: state.info.groom, brideName: state.info.bride,
      groomBirthDate: state.info.groomBirthDate, brideBirthDate: state.info.brideBirthDate,
    };
  }, [state.page, state.lang, state.region, state.themeId, state.budget, state.guests.length, state.onboardingComplete, state.info.date, state.info.groom, state.info.bride, state.info.groomBirthDate, state.info.brideBirthDate, track]);

  const handleGoAI = (hint: string) => {
    void hint;
    store.setPage("ai");
  };

  if (!state.onboardingComplete) {
    return <OnboardingWizard store={store} track={track} />;
  }

  return (
    <div
      className="min-h-screen flex flex-col text-[#2c1810]"
      style={{
        backgroundColor: theme.bg,
        "--theme-primary": theme.primary,
        "--theme-primary-dark": theme.primaryDark,
        "--theme-primary-light": theme.primaryLight,
        "--theme-accent": theme.accent,
        "--theme-surface": theme.surface,
        "--theme-surface-muted": theme.surfaceMuted,
        "--theme-border": theme.themeBorder,
        "--theme-bg": theme.bg,
        "--theme-note-bg": theme.noteBg,
        "--theme-note-border": theme.noteBorder,
        "--theme-note-text": theme.noteText,
        "--primary": theme.primaryHSL,
        "--primary-foreground": theme.primaryForegroundHSL,
      } as React.CSSProperties}
    >
      {/* Full-width header */}
      <Navbar
        activePage={state.page}
        lang={state.lang}
        weddingDate={state.info.date}
        state={state}
        isOnline={isOnline}
        onLeftSidebarOpen={() => setLeftOpen(true)}
        onRightSidebarOpen={() => setRightOpen(true)}
      />

      {/* Body: left sidebar + content + right sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <LeftSidebar
          activePage={state.page}
          onPageChange={store.setPage}
          lang={state.lang}
          progressPct={progress.pct}
          done={progress.done}
          total={progress.total}
          mobileOpen={leftOpen}
          onMobileOpenChange={setLeftOpen}
        />

        {/* Main content - centered */}
        <main className="flex-1 overflow-y-auto">
          <div
            key={state.page}
            className="page-transition-enter max-w-[920px] mx-auto px-3 sm:px-4 pt-2 pb-20 md:pb-4"
          >
            <PageRouter
              state={state}
              store={store}
              progress={progress}
              onGoAI={handleGoAI}
              userId={userId}
            />
          </div>

          {/* Full-width footer */}
          <Footer lang={state.lang} />
        </main>
      </div>

      {/* Flying right sidebar */}
      <RightSidebar
        lang={state.lang}
        onSetLang={store.setLang}
        region={state.region}
        onSetRegion={store.setRegion}
        weddingDate={state.info.date}
        info={state.info}
        state={state}
        activeTheme={state.themeId || DEFAULT_THEME_ID}
        onSelectTheme={store.setTheme}
        isOnline={isOnline}
        mobileOpen={rightOpen}
        onMobileOpenChange={setRightOpen}
      />

      {/* Mobile bottom nav */}
      <BottomNav
        activePage={state.page}
        onPageChange={store.setPage}
        onMenuOpen={() => setLeftOpen(true)}
        lang={state.lang}
      />

      <SaveToast visible={showSave} />
      <InstallPrompt lang={state.lang} />
    </div>
  );
}

export default App;
