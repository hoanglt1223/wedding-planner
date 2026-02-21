import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { WeddingState, Guest, WeddingStep } from "@/types/wedding";
import { DEFAULT_STATE } from "@/data/backgrounds";
import { WEDDING_STEPS } from "@/data/wedding-steps";
import { migrateState } from "@/lib/migrate-state";

// Run migration once on module load
migrateState();

const STORAGE_KEY = "wp_v8";

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
      st: { ...prev.st, [stepId]: index },
    }));
  }, [setState]);

  const toggleCheck = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      ck: { ...prev.ck, [key]: !prev.ck[key] },
    }));
  }, [setState]);

  const setBudget = useCallback((bud: number) => {
    setState((prev) => ({ ...prev, bud }));
  }, [setState]);

  const setCategoryPercent = useCallback((key: string, pct: number) => {
    setState((prev) => ({
      ...prev,
      bo: { ...prev.bo, [key]: pct },
    }));
  }, [setState]);

  const updateInfo = useCallback(
    (field: string, value: string) => {
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
      gid: prev.gid + 1,
      guests: [...prev.guests, { ...guest, id: prev.gid + 1 }],
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
      let gid = prev.gid;
      const guests = [
        ...prev.guests,
        ...newGuests.map((g) => ({ ...g, id: ++gid })),
      ];
      return { ...prev, guests, gid };
    });
  }, [setState]);

  const setApiKey = useCallback((zk: string) => {
    setState((prev) => ({ ...prev, zk }));
  }, [setState]);

  const setAiResponse = useCallback((ar: string) => {
    setState((prev) => ({ ...prev, ar }));
  }, [setState]);

  const getProgress = useCallback(() => {
    let total = 0;
    let done = 0;
    (WEDDING_STEPS as WeddingStep[]).forEach((s) =>
      s.cers.forEach((c, ci: number) =>
        c.cl.forEach((_item, i: number) => {
          total++;
          if (state.ck[`${s.id}_${ci}_${i}`]) done++;
        }),
      ),
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [state.ck]);

  return {
    state,
    setState,
    setPage,
    setTab,
    setSubTab,
    toggleCheck,
    setBudget,
    setCategoryPercent,
    updateInfo,
    addGuest,
    removeGuest,
    clearGuests,
    importGuests,
    setApiKey,
    setAiResponse,
    getProgress,
  };
}

export type WeddingStore = ReturnType<typeof useWeddingStore>;
