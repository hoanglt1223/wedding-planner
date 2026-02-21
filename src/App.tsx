import { useEffect, useRef, useState } from "react";
import { useWeddingStore } from "@/hooks/use-wedding-store";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Topbar } from "@/components/layout/topbar";
import { SaveToast } from "@/components/wedding/save-toast";
import { PageRouter } from "@/pages/page-router";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

function App() {
  const store = useWeddingStore();
  const { state } = store;
  const progress = store.getProgress();

  const theme = THEMES.find((t) => t.id === (state.themeId || DEFAULT_THEME_ID)) || THEMES[0];

  const [showSave, setShowSave] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mountRef = useRef(false);

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

  const handleGoAI = (hint: string) => {
    void hint;
    store.setPage("ai");
  };

  return (
    <div
      className="min-h-screen text-[#2c1810]"
      style={{
        backgroundColor: theme.primaryLight,
        "--theme-primary": theme.primary,
        "--theme-primary-dark": theme.primaryDark,
        "--theme-primary-light": theme.primaryLight,
        "--theme-accent": theme.accent,
      } as React.CSSProperties}
    >
      <Header
        progressPct={progress.pct}
        done={progress.done}
        total={progress.total}
        weddingDate={state.info.date}
        themePrimary={theme.primary}
        themeDark={theme.primaryDark}
        info={state.info}
      />
      <Topbar activePage={state.page} onPageChange={store.setPage} lang={state.lang} />
      <div className="max-w-[920px] mx-auto px-2 pt-2">
        <PageRouter
          state={state}
          store={store}
          progress={progress}
          onGoAI={handleGoAI}
        />
      </div>
      <Footer activeTheme={state.themeId || DEFAULT_THEME_ID} onSelectTheme={store.setTheme} lang={state.lang} onSetLang={store.setLang} />
      <SaveToast visible={showSave} />
    </div>
  );
}

export default App;
