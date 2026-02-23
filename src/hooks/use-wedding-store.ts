import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { WeddingState, Guest, Vendor, PhotoItem, WeddingStep, Region } from "@/types/wedding";
import { DEFAULT_STATE } from "@/data/backgrounds";
import { getWeddingSteps } from "@/data/resolve-data";
import { migrateState } from "@/lib/migrate-state";

// Run migration once on module load
migrateState();

const STORAGE_KEY = "wp_v13";

export function useWeddingStore() {
  const [state, setState] = useLocalStorage<WeddingState>(
    STORAGE_KEY,
    DEFAULT_STATE,
  );

  const setPage = useCallback((page: string) => {
    setState((prev) => ({ ...prev, page }));
  }, [setState]);

  const setTab = useCallback((tab: number) => {
    setState((prev) => ({ ...prev, tab }));
  }, [setState]);

  const setSubTab = useCallback((stepId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      subTabs: { ...prev.subTabs, [stepId]: index },
    }));
  }, [setState]);

  const toggleCheck = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      checkedItems: { ...prev.checkedItems, [key]: !prev.checkedItems[key] },
    }));
  }, [setState]);

  const setBudget = useCallback((budget: number) => {
    setState((prev) => ({ ...prev, budget }));
  }, [setState]);

  const setCategoryPercent = useCallback((key: string, pct: number) => {
    setState((prev) => ({
      ...prev,
      budgetOverrides: { ...prev.budgetOverrides, [key]: pct },
    }));
  }, [setState]);

  const setExpense = useCallback((key: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, [key]: amount },
    }));
  }, [setState]);

  const updateInfo = useCallback(
    (field: string, value: string | number | null) => {
      setState((prev) => ({
        ...prev,
        info: { ...prev.info, [field]: value },
      }));
    },
    [setState],
  );

  const addGuest = useCallback((guest: Omit<Guest, "id">) => {
    setState((prev) => ({
      ...prev,
      guestIdCounter: prev.guestIdCounter + 1,
      guests: [...prev.guests, { ...guest, id: prev.guestIdCounter + 1 }],
    }));
  }, [setState]);

  const removeGuest = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
    }));
  }, [setState]);

  const clearGuests = useCallback(() => {
    setState((prev) => ({ ...prev, guests: [] }));
  }, [setState]);

  const importGuests = useCallback((newGuests: Omit<Guest, "id">[]) => {
    setState((prev) => {
      let counter = prev.guestIdCounter;
      const guests = [
        ...prev.guests,
        ...newGuests.map((g) => ({ ...g, id: ++counter })),
      ];
      return { ...prev, guests, guestIdCounter: counter };
    });
  }, [setState]);

  const setApiKey = useCallback((apiKey: string) => {
    setState((prev) => ({ ...prev, apiKey }));
  }, [setState]);

  const setAiResponse = useCallback((aiResponse: string) => {
    setState((prev) => ({ ...prev, aiResponse }));
  }, [setState]);

  const setTheme = useCallback((themeId: string) => {
    setState((prev) => ({ ...prev, themeId }));
  }, [setState]);

  const setNotes = useCallback((notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  }, [setState]);

  const addVendor = useCallback((vendor: Omit<Vendor, "id">) => {
    setState((prev) => ({
      ...prev,
      vendorIdCounter: prev.vendorIdCounter + 1,
      vendors: [...(prev.vendors || []), { ...vendor, id: prev.vendorIdCounter + 1 }],
    }));
  }, [setState]);

  const removeVendor = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vendors: (prev.vendors || []).filter((v) => v.id !== id),
    }));
  }, [setState]);

  const addPhoto = useCallback((photo: Omit<PhotoItem, "id">) => {
    setState((prev) => ({
      ...prev,
      photoIdCounter: prev.photoIdCounter + 1,
      photos: [...(prev.photos || []), { ...photo, id: prev.photoIdCounter + 1 }],
    }));
  }, [setState]);

  const removePhoto = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((p) => p.id !== id),
    }));
  }, [setState]);

  const setLang = useCallback((lang: string) => {
    setState((prev) => ({ ...prev, lang }));
  }, [setState]);

  const setRegion = useCallback((region: Region) => {
    setState((prev) => ({ ...prev, region }));
  }, [setState]);

  const setPartyTime = useCallback((partyTime: "noon" | "afternoon") => {
    setState((prev) => ({ ...prev, partyTime }));
  }, [setState]);

  const setStepStartTime = useCallback((stepId: string, time: string) => {
    setState((prev) => ({
      ...prev,
      stepStartTimes: { ...(prev.stepStartTimes || {}), [stepId]: time },
    }));
  }, [setState]);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingComplete: true }));
  }, [setState]);

  const getProgress = useCallback(() => {
    let total = 0;
    let done = 0;
    (getWeddingSteps(state.lang) as WeddingStep[]).forEach((step) =>
      step.ceremonies.forEach((ceremony, ci: number) => {
        let checkIdx = 0;
        ceremony.steps.forEach((s) => {
          if (s.checkable) {
            total++;
            if (state.checkedItems[`${step.id}_${ci}_${checkIdx}`]) done++;
            checkIdx++;
          }
        });
      }),
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [state.checkedItems, state.lang]);

  return {
    state,
    setState,
    setPage,
    setTab,
    setSubTab,
    toggleCheck,
    setBudget,
    setCategoryPercent,
    setExpense,
    updateInfo,
    addGuest,
    removeGuest,
    clearGuests,
    importGuests,
    setApiKey,
    setAiResponse,
    setTheme,
    setNotes,
    addVendor,
    removeVendor,
    addPhoto,
    removePhoto,
    setLang,
    setRegion,
    setPartyTime,
    setStepStartTime,
    completeOnboarding,
    getProgress,
  };
}

export type WeddingStore = ReturnType<typeof useWeddingStore>;
