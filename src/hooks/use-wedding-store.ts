import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { WeddingState, Guest, Vendor, PhotoItem, WeddingStep, Region, RsvpSettings, ExpenseEntry, SeatingTable, WeddingContact, VendorPayment, SongItem, SpeechEntry, GuestBookEntry, WeddingPartyMember, MoodBoardItem, ColorPalette } from "@/types/wedding";
import { DEFAULT_STATE } from "@/data/backgrounds";
import { getWeddingSteps } from "@/data/resolve-data";
import { migrateState } from "@/lib/migrate-state";
import { usePhase2Methods } from "./use-wedding-store-phase2";

// Run migration once on module load
migrateState();

const STORAGE_KEY = "wp_v16";

/** A step is enabled if enabledSteps is empty/undefined (all enabled) or the step's value is not false */
export function isStepEnabled(enabledSteps: Record<string, boolean> | undefined, stepId: string): boolean {
  if (!enabledSteps || Object.keys(enabledSteps).length === 0) return true;
  return enabledSteps[stepId] !== false;
}

export function useWeddingStore() {
  const [state, setState] = useLocalStorage<WeddingState>(
    STORAGE_KEY,
    DEFAULT_STATE,
  );

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

  const updateGuest = useCallback((id: number, updates: Partial<Guest>) => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => g.id === id ? { ...g, ...updates } : g),
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

  const updateVendor = useCallback((id: number, updates: Partial<Vendor>) => {
    setState((prev) => ({
      ...prev,
      vendors: (prev.vendors || []).map((v) => v.id === id ? { ...v, ...updates } : v),
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

  const setEnabledSteps = useCallback((enabledSteps: Record<string, boolean>) => {
    setState((prev) => ({ ...prev, enabledSteps }));
  }, [setState]);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingComplete: true }));
  }, [setState]);

  const setRsvpSettings = useCallback((settings: Partial<RsvpSettings>) => {
    setState((prev) => ({
      ...prev,
      rsvpSettings: { ...(prev.rsvpSettings || { welcomeMessage: "", venue: "", venueAddress: "", venueMapLink: "", coupleStory: "" }), ...settings },
    }));
  }, [setState]);

  const updateGuestRsvpToken = useCallback((guestId: number, token: string) => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => g.id === guestId ? { ...g, rsvpToken: token } : g),
    }));
  }, [setState]);

  const addExpense = useCallback((entry: Omit<ExpenseEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      expenseIdCounter: (prev.expenseIdCounter || 0) + 1,
      expenseLog: [...(prev.expenseLog || []), { ...entry, id: (prev.expenseIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const updateExpense = useCallback((id: number, updates: Partial<ExpenseEntry>) => {
    setState((prev) => ({
      ...prev,
      expenseLog: (prev.expenseLog || []).map((e) => e.id === id ? { ...e, ...updates } : e),
    }));
  }, [setState]);

  const removeExpense = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      expenseLog: (prev.expenseLog || []).filter((e) => e.id !== id),
    }));
  }, [setState]);

  const toggleChecklistItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      checkedChecklistItems: {
        ...(prev.checkedChecklistItems || {}),
        [itemId]: !prev.checkedChecklistItems?.[itemId],
      },
    }));
  }, [setState]);

  const toggleKitItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      weddingDayKitChecked: {
        ...(prev.weddingDayKitChecked || {}),
        [itemId]: !prev.weddingDayKitChecked?.[itemId],
      },
    }));
  }, [setState]);

  const addCustomKitItem = useCallback((categoryId: string, textVi: string, textEn: string) => {
    const id = `custom-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      weddingDayKitCustom: [
        ...(prev.weddingDayKitCustom || []),
        { id, categoryId, textVi, textEn, icon: "✅" },
      ],
    }));
  }, [setState]);

  const removeCustomKitItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      weddingDayKitCustom: (prev.weddingDayKitCustom || []).filter((i) => i.id !== itemId),
      weddingDayKitChecked: (() => {
        const { [itemId]: _, ...rest } = prev.weddingDayKitChecked || {};
        return rest;
      })(),
    }));
  }, [setState]);

  // Seating chart methods
  const addSeatingTable = useCallback((table: Omit<SeatingTable, "id" | "guestIds">) => {
    setState((prev) => ({
      ...prev,
      seatingTableIdCounter: (prev.seatingTableIdCounter || 0) + 1,
      seatingTables: [
        ...(prev.seatingTables || []),
        { ...table, id: (prev.seatingTableIdCounter || 0) + 1, guestIds: [] },
      ],
    }));
  }, [setState]);

  const updateSeatingTable = useCallback((id: number, updates: Partial<Omit<SeatingTable, "id">>) => {
    setState((prev) => ({
      ...prev,
      seatingTables: (prev.seatingTables || []).map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  }, [setState]);

  const removeSeatingTable = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      seatingTables: (prev.seatingTables || []).filter((t) => t.id !== id),
    }));
  }, [setState]);

  const assignGuestToTable = useCallback((guestId: number, tableId: number) => {
    setState((prev) => {
      const tables = (prev.seatingTables || []).map((t) => ({
        ...t,
        guestIds: t.guestIds.filter((gid) => gid !== guestId),
      }));
      return {
        ...prev,
        seatingTables: tables.map((t) =>
          t.id === tableId ? { ...t, guestIds: [...t.guestIds, guestId] } : t
        ),
      };
    });
  }, [setState]);

  const unassignGuest = useCallback((guestId: number) => {
    setState((prev) => ({
      ...prev,
      seatingTables: (prev.seatingTables || []).map((t) => ({
        ...t,
        guestIds: t.guestIds.filter((gid) => gid !== guestId),
      })),
    }));
  }, [setState]);

  // Wedding contacts methods
  const addContact = useCallback((contact: Omit<WeddingContact, "id">) => {
    setState((prev) => ({
      ...prev,
      contactIdCounter: (prev.contactIdCounter || 0) + 1,
      contacts: [...(prev.contacts || []), { ...contact, id: (prev.contactIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const updateContact = useCallback((id: number, updates: Partial<WeddingContact>) => {
    setState((prev) => ({
      ...prev,
      contacts: (prev.contacts || []).map((c) => c.id === id ? { ...c, ...updates } : c),
    }));
  }, [setState]);

  const removeContact = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      contacts: (prev.contacts || []).filter((c) => c.id !== id),
    }));
  }, [setState]);

  // Vendor payment methods
  const addVendorPayment = useCallback((payment: Omit<VendorPayment, "id">) => {
    setState((prev) => ({
      ...prev,
      vendorPaymentIdCounter: (prev.vendorPaymentIdCounter || 0) + 1,
      vendorPayments: [
        ...(prev.vendorPayments || []),
        { ...payment, id: (prev.vendorPaymentIdCounter || 0) + 1 },
      ],
    }));
  }, [setState]);

  const updateVendorPayment = useCallback((id: number, updates: Partial<VendorPayment>) => {
    setState((prev) => ({
      ...prev,
      vendorPayments: (prev.vendorPayments || []).map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  }, [setState]);

  const removeVendorPayment = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vendorPayments: (prev.vendorPayments || []).filter((p) => p.id !== id),
    }));
  }, [setState]);

  // Song list methods
  const addSong = useCallback((song: Omit<SongItem, "id">) => {
    setState((prev) => ({
      ...prev,
      songIdCounter: (prev.songIdCounter || 0) + 1,
      songs: [...(prev.songs || []), { ...song, id: (prev.songIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const updateSong = useCallback((id: number, updates: Partial<SongItem>) => {
    setState((prev) => ({
      ...prev,
      songs: (prev.songs || []).map((s) => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [setState]);

  const removeSong = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      songs: (prev.songs || []).filter((s) => s.id !== id),
    }));
  }, [setState]);

  // Speech / Vow methods
  const addSpeech = useCallback((speech: Omit<SpeechEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      speechIdCounter: (prev.speechIdCounter || 0) + 1,
      speeches: [...(prev.speeches || []), { ...speech, id: (prev.speechIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const updateSpeech = useCallback((id: number, updates: Partial<SpeechEntry>) => {
    setState((prev) => ({
      ...prev,
      speeches: (prev.speeches || []).map((s) => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [setState]);

  const removeSpeech = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      speeches: (prev.speeches || []).filter((s) => s.id !== id),
    }));
  }, [setState]);

  // Guest Book methods
  const addGuestBookEntry = useCallback((entry: Omit<GuestBookEntry, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      guestBookIdCounter: (prev.guestBookIdCounter || 0) + 1,
      guestBookEntries: [
        ...(prev.guestBookEntries || []),
        {
          ...entry,
          id: (prev.guestBookIdCounter || 0) + 1,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [setState]);

  const updateGuestBookEntry = useCallback((id: number, updates: Partial<GuestBookEntry>) => {
    setState((prev) => ({
      ...prev,
      guestBookEntries: (prev.guestBookEntries || []).map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
  }, [setState]);

  const removeGuestBookEntry = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      guestBookEntries: (prev.guestBookEntries || []).filter((e) => e.id !== id),
    }));
  }, [setState]);

  const toggleGuestBookFavorite = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      guestBookEntries: (prev.guestBookEntries || []).map((e) =>
        e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
      ),
    }));
  }, [setState]);

  // Wedding Party methods
  const addPartyMember = useCallback((member: Omit<WeddingPartyMember, "id">) => {
    setState((prev) => ({
      ...prev,
      weddingPartyIdCounter: (prev.weddingPartyIdCounter || 0) + 1,
      weddingParty: [
        ...(prev.weddingParty || []),
        { ...member, id: (prev.weddingPartyIdCounter || 0) + 1 },
      ],
    }));
  }, [setState]);

  const updatePartyMember = useCallback((id: number, updates: Partial<WeddingPartyMember>) => {
    setState((prev) => ({
      ...prev,
      weddingParty: (prev.weddingParty || []).map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  }, [setState]);

  const removePartyMember = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      weddingParty: (prev.weddingParty || []).filter((m) => m.id !== id),
    }));
  }, [setState]);

  // Mood Board methods
  const addMoodBoardItem = useCallback((item: Omit<MoodBoardItem, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      moodBoardIdCounter: (prev.moodBoardIdCounter || 0) + 1,
      moodBoardItems: [
        ...(prev.moodBoardItems || []),
        {
          ...item,
          id: (prev.moodBoardIdCounter || 0) + 1,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [setState]);

  const updateMoodBoardItem = useCallback((id: number, updates: Partial<MoodBoardItem>) => {
    setState((prev) => ({
      ...prev,
      moodBoardItems: (prev.moodBoardItems || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }, [setState]);

  const removeMoodBoardItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      moodBoardItems: (prev.moodBoardItems || []).filter((item) => item.id !== id),
    }));
  }, [setState]);

  const toggleMoodBoardFavorite = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      moodBoardItems: (prev.moodBoardItems || []).map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ),
    }));
  }, [setState]);

  // Color Palette methods
  const addColorPalette = useCallback((palette: Omit<ColorPalette, "id">) => {
    setState((prev) => ({
      ...prev,
      colorPaletteIdCounter: (prev.colorPaletteIdCounter || 0) + 1,
      colorPalettes: [
        ...(prev.colorPalettes || []),
        { ...palette, id: (prev.colorPaletteIdCounter || 0) + 1 },
      ],
    }));
  }, [setState]);

  const updateColorPalette = useCallback((id: number, updates: Partial<ColorPalette>) => {
    setState((prev) => ({
      ...prev,
      colorPalettes: (prev.colorPalettes || []).map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  }, [setState]);

  const removeColorPalette = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      colorPalettes: (prev.colorPalettes || []).filter((p) => p.id !== id),
    }));
  }, [setState]);

  const phase2 = usePhase2Methods(setState);

  const getProgress = useCallback(() => {
    let total = 0;
    let done = 0;
    const enabled = state.enabledSteps || {};
    (getWeddingSteps(state.lang) as WeddingStep[])
      .filter((step) => isStepEnabled(enabled, step.id))
      .forEach((step) =>
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
  }, [state.checkedItems, state.lang, state.enabledSteps]);

  return {
    state,
    setState,
    setTab, setSubTab, toggleCheck,
    setBudget, setCategoryPercent, setExpense,
    updateInfo, addGuest, removeGuest, updateGuest, clearGuests, importGuests,
    setApiKey, setAiResponse, setTheme, setNotes,
    addVendor, removeVendor, updateVendor, addPhoto, removePhoto,
    setLang, setRegion, setPartyTime, setStepStartTime, setEnabledSteps,
    completeOnboarding, getProgress, setRsvpSettings, updateGuestRsvpToken,
    addExpense, updateExpense, removeExpense,
    toggleChecklistItem,
    toggleKitItem, addCustomKitItem, removeCustomKitItem,
    addSeatingTable, updateSeatingTable, removeSeatingTable,
    assignGuestToTable, unassignGuest,
    addContact, updateContact, removeContact,
    addVendorPayment, updateVendorPayment, removeVendorPayment,
    addSong, updateSong, removeSong,
    addSpeech, updateSpeech, removeSpeech,
    addGuestBookEntry, updateGuestBookEntry, removeGuestBookEntry, toggleGuestBookFavorite,
    addPartyMember, updatePartyMember, removePartyMember,
    addMoodBoardItem, updateMoodBoardItem, removeMoodBoardItem, toggleMoodBoardFavorite,
    addColorPalette, updateColorPalette, removeColorPalette,
    ...phase2,
  };
}

export type WeddingStore = ReturnType<typeof useWeddingStore>;
