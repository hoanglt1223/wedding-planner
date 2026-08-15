import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { WeddingState, Guest, Vendor, VendorQuote, PhotoItem, WeddingStep, Region, RsvpSettings, ExpenseEntry, SeatingTable, WeddingContact, VendorPayment, VendorCommunication, SongItem, SpeechEntry, GuestBookEntry, WeddingPartyMember, MoodBoardItem, ColorPalette, QuickNote, RegistryItem, TransportationGroup, PhotoShot, WelcomeBagItem, WelcomeBagDistribution, MenuItem, MenuSettings, ImportantDate, HoneymoonState, HoneymoonTask, EmergencyContact, TimelineAlert, BackupPlan, EmergencySupply, VendorGratitude, VendorReview } from "@/types/wedding";
import type { WeddingContract, PaymentMilestone } from "@/types/contracts";
import type { ItineraryItem } from "@/data/wedding-itinerary";
import { DEFAULT_STATE, DEFAULT_HONEYMOON } from "@/data/backgrounds";
import { getWeddingSteps } from "@/data/resolve-data";
import { migrateState } from "@/lib/migrate-state";
import { usePhase2Methods } from "./use-wedding-store-phase2";

// Run migration once on module load
migrateState();

const STORAGE_KEY = "wp_v18";

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
      vendors: [...(prev.vendors || []), { ...vendor, id: prev.vendorIdCounter + 1, quotes: vendor.quotes ?? [] }],
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

  const addVendorQuote = useCallback((vendorId: number, quote: Omit<VendorQuote, "id" | "vendorId" | "createdAt">) => {
    setState((prev) => {
      let quoteId = 0;
      const vendors = (prev.vendors || []).map((v) => {
        if (v.id !== vendorId) return v;
        const maxId = v.quotes.reduce((m, q) => Math.max(m, q.id), 0);
        quoteId = maxId + 1;
        return {
          ...v,
          quotes: [...v.quotes, { ...quote, id: quoteId, vendorId, createdAt: new Date().toISOString() }],
        };
      });
      return { ...prev, vendors };
    });
  }, [setState]);

  const updateVendorQuote = useCallback((vendorId: number, quoteId: number, updates: Partial<VendorQuote>) => {
    setState((prev) => ({
      ...prev,
      vendors: (prev.vendors || []).map((v) => {
        if (v.id !== vendorId) return v;
        return { ...v, quotes: v.quotes.map((q) => q.id === quoteId ? { ...q, ...updates } : q) };
      }),
    }));
  }, [setState]);

  const removeVendorQuote = useCallback((vendorId: number, quoteId: number) => {
    setState((prev) => ({
      ...prev,
      vendors: (prev.vendors || []).map((v) => {
        if (v.id !== vendorId) return v;
        return { ...v, quotes: v.quotes.filter((q) => q.id !== quoteId) };
      }),
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

  // Itinerary methods
  const setItineraryItems = useCallback((items: ItineraryItem[]) => {
    setState((prev) => ({ ...prev, itineraryItems: items }));
  }, [setState]);

  const addItineraryItem = useCallback((item: ItineraryItem) => {
    setState((prev) => ({
      ...prev,
      itineraryItems: [...(prev.itineraryItems || []), item],
    }));
  }, [setState]);

  const updateItineraryItem = useCallback((id: string, updates: Partial<ItineraryItem>) => {
    setState((prev) => ({
      ...prev,
      itineraryItems: (prev.itineraryItems || []).map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
  }, [setState]);

  const removeItineraryItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      itineraryItems: (prev.itineraryItems || []).filter((i) => i.id !== id),
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

  const addVendorCommunication = useCallback((communication: Omit<VendorCommunication, "id">) => {
    setState((prev) => ({
      ...prev,
      vendorCommunicationIdCounter: (prev.vendorCommunicationIdCounter || 0) + 1,
      vendorCommunications: [
        ...(prev.vendorCommunications || []),
        { ...communication, id: (prev.vendorCommunicationIdCounter || 0) + 1 },
      ],
    }));
  }, [setState]);

  const updateVendorCommunication = useCallback((id: number, updates: Partial<VendorCommunication>) => {
    setState((prev) => ({
      ...prev,
      vendorCommunications: (prev.vendorCommunications || []).map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  }, [setState]);

  const removeVendorCommunication = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vendorCommunications: (prev.vendorCommunications || []).filter((c) => c.id !== id),
    }));
  }, [setState]);

  // Vendor gratitude/tip tracking methods
  const addVendorGratitude = useCallback((gratitude: Omit<VendorGratitude, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      vendorGratitudeIdCounter: (prev.vendorGratitudeIdCounter || 0) + 1,
      vendorGratitude: [...(prev.vendorGratitude || []), { ...gratitude, id: (prev.vendorGratitudeIdCounter || 0) + 1, createdAt: new Date().toISOString() }],
    }));
  }, [setState]);

  const updateVendorGratitude = useCallback((id: number, updates: Partial<VendorGratitude>) => {
    setState((prev) => ({
      ...prev,
      vendorGratitude: (prev.vendorGratitude || []).map((g) => g.id === id ? { ...g, ...updates } : g),
    }));
  }, [setState]);

  const removeVendorGratitude = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vendorGratitude: (prev.vendorGratitude || []).filter((g) => g.id !== id),
    }));
  }, [setState]);

  // Vendor review methods
  const addReview = useCallback((review: Omit<VendorReview, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      vendorReviewIdCounter: (prev.vendorReviewIdCounter || 0) + 1,
      vendorReviews: [...(prev.vendorReviews || []), { ...review, id: (prev.vendorReviewIdCounter || 0) + 1, createdAt: new Date().toISOString() }],
    }));
  }, [setState]);

  const updateReview = useCallback((id: number, updates: Partial<VendorReview>) => {
    setState((prev) => ({
      ...prev,
      vendorReviews: (prev.vendorReviews || []).map((r) => r.id === id ? { ...r, ...updates } : r),
    }));
  }, [setState]);

  const deleteReview = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vendorReviews: (prev.vendorReviews || []).filter((r) => r.id !== id),
    }));
  }, [setState]);

  const getVendorReviews = useCallback((vendorId: number): VendorReview[] => {
    return (state.vendorReviews || []).filter((r) => r.vendorId === vendorId);
  }, [state.vendorReviews]);

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

  // Quick Notes methods
  const addQuickNote = useCallback((text: string, color: QuickNote["color"] = "yellow") => {
    setState((prev) => ({
      ...prev,
      quickNoteIdCounter: (prev.quickNoteIdCounter || 0) + 1,
      quickNotes: [
        ...(prev.quickNotes || []),
        {
          id: (prev.quickNoteIdCounter || 0) + 1,
          text,
          color,
          done: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [setState]);

  const toggleQuickNote = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      quickNotes: (prev.quickNotes || []).map((n) =>
        n.id === id ? { ...n, done: !n.done } : n
      ),
    }));
  }, [setState]);

  const removeQuickNote = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      quickNotes: (prev.quickNotes || []).filter((n) => n.id !== id),
    }));
  }, [setState]);

  // Gift Registry methods
  const addRegistryItem = useCallback((item: Omit<RegistryItem, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      registryIdCounter: (prev.registryIdCounter || 0) + 1,
      registryItems: [
        ...(prev.registryItems || []),
        {
          ...item,
          id: (prev.registryIdCounter || 0) + 1,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [setState]);

  const updateRegistryItem = useCallback((id: number, updates: Partial<RegistryItem>) => {
    setState((prev) => ({
      ...prev,
      registryItems: (prev.registryItems || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }, [setState]);

  const removeRegistryItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      registryItems: (prev.registryItems || []).filter((item) => item.id !== id),
    }));
  }, [setState]);

  const toggleRegistryFulfilled = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      registryItems: (prev.registryItems || []).map((item) =>
        item.id === id ? { ...item, fulfilled: !item.fulfilled } : item
      ),
    }));
  }, [setState]);

  // Transportation methods
  const addTransportationGroup = useCallback((group: Omit<TransportationGroup, "id" | "guestIds">) => {
    setState((prev) => ({
      ...prev,
      transportationGroupIdCounter: (prev.transportationGroupIdCounter || 0) + 1,
      transportationGroups: [
        ...(prev.transportationGroups || []),
        { ...group, id: (prev.transportationGroupIdCounter || 0) + 1, guestIds: [] },
      ],
    }));
  }, [setState]);

  const updateTransportationGroup = useCallback((id: number, updates: Partial<Omit<TransportationGroup, "id">>) => {
    setState((prev) => ({
      ...prev,
      transportationGroups: (prev.transportationGroups || []).map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    }));
  }, [setState]);

  const removeTransportationGroup = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      transportationGroups: (prev.transportationGroups || []).filter((g) => g.id !== id),
    }));
  }, [setState]);

  const assignGuestToTransport = useCallback((guestId: number, groupId: number) => {
    setState((prev) => {
      const groups = (prev.transportationGroups || []).map((g) => ({
        ...g,
        guestIds: g.guestIds.filter((gid) => gid !== guestId),
      }));
      return {
        ...prev,
        transportationGroups: groups.map((g) =>
          g.id === groupId ? { ...g, guestIds: [...g.guestIds, guestId] } : g
        ),
      };
    });
  }, [setState]);

  const unassignGuestFromTransport = useCallback((guestId: number) => {
    setState((prev) => ({
      ...prev,
      transportationGroups: (prev.transportationGroups || []).map((g) => ({
        ...g,
        guestIds: g.guestIds.filter((gid) => gid !== guestId),
      })),
    }));
  }, [setState]);

  const addGuestGift = useCallback((
    giftName: string,
    category: string,
    description: string,
    costPerUnit: number,
    totalQuantity: number,
    recipientType: string,
    notes: string
  ) => {
    setState((prev) => {
      const newId = (prev.guestGiftIdCounter || 0) + 1;
      return {
        ...prev,
        guestGifts: [
          ...(prev.guestGifts || []),
          {
            id: newId,
            giftName,
            category: category as any,
            description,
            costPerUnit,
            totalQuantity,
            distributedQuantity: 0,
            status: "pending",
            recipientType: recipientType as any,
            assignedGuestIds: [],
            notes,
            createdAt: new Date().toISOString(),
          },
        ],
        guestGiftIdCounter: newId,
      };
    });
  }, [setState]);

  const updateGuestGift = useCallback((id: number, updates: Partial<{
    giftName: string;
    category: string;
    description: string;
    costPerUnit: number;
    totalQuantity: number;
    distributedQuantity: number;
    status: string;
    recipientType: string;
    assignedGuestIds: number[];
    notes: string;
  }>) => {
    setState((prev) => ({
      ...prev,
      guestGifts: (prev.guestGifts || []).map((g) =>
        g.id === id ? { ...g, ...updates } as any : g
      ),
    }));
  }, [setState]);

  const removeGuestGift = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      guestGifts: (prev.guestGifts || []).filter((g) => g.id !== id),
    }));
  }, [setState]);

  const markGiftDistributed = useCallback((id: number, quantity: number) => {
    setState((prev) => ({
      ...prev,
      guestGifts: (prev.guestGifts || []).map((g) =>
        g.id === id
          ? { ...g, distributedQuantity: Math.min(g.totalQuantity, g.distributedQuantity + quantity), status: "distributed" as any }
          : g
      ),
    }));
  }, [setState]);

  const addPhotoShot = useCallback((shot: Omit<PhotoShot, "id">) => {
    setState((prev) => ({
      ...prev,
      photoShotIdCounter: (prev.photoShotIdCounter || 0) + 1,
      photoShots: [...(prev.photoShots || []), { ...shot, id: (prev.photoShotIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const removePhotoShot = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      photoShots: (prev.photoShots || []).filter((s) => s.id !== id),
    }));
  }, [setState]);

  const updatePhotoShot = useCallback((id: number, updates: Partial<PhotoShot>) => {
    setState((prev) => ({
      ...prev,
      photoShots: (prev.photoShots || []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, [setState]);

  // Welcome Bag methods
  const addWelcomeBagItem = useCallback((item: Omit<WelcomeBagItem, "id">) => {
    setState((prev) => ({
      ...prev,
      welcomeBagItemIdCounter: (prev.welcomeBagItemIdCounter || 0) + 1,
      welcomeBagItems: [...(prev.welcomeBagItems || []), { ...item, id: (prev.welcomeBagItemIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const removeWelcomeBagItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      welcomeBagItems: (prev.welcomeBagItems || []).filter((i) => i.id !== id),
    }));
  }, [setState]);

  const updateWelcomeBagItem = useCallback((id: number, updates: Partial<WelcomeBagItem>) => {
    setState((prev) => ({
      ...prev,
      welcomeBagItems: (prev.welcomeBagItems || []).map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }, [setState]);

  const toggleWelcomeBagItemChecked = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      welcomeBagItems: (prev.welcomeBagItems || []).map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    }));
  }, [setState]);

  const addWelcomeBagDistribution = useCallback((distribution: Omit<WelcomeBagDistribution, "id">) => {
    setState((prev) => ({
      ...prev,
      welcomeBagDistributionIdCounter: (prev.welcomeBagDistributionIdCounter || 0) + 1,
      welcomeBagDistributions: [...(prev.welcomeBagDistributions || []), { ...distribution, id: (prev.welcomeBagDistributionIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const removeWelcomeBagDistribution = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      welcomeBagDistributions: (prev.welcomeBagDistributions || []).filter((d) => d.id !== id),
    }));
  }, [setState]);

  const updateWelcomeBagDistribution = useCallback((id: number, updates: Partial<WelcomeBagDistribution>) => {
    setState((prev) => ({
      ...prev,
      welcomeBagDistributions: (prev.welcomeBagDistributions || []).map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  }, [setState]);

  // Menu Planner methods
  const addMenuItem = useCallback((item: Omit<MenuItem, "id">) => {
    setState((prev) => ({
      ...prev,
      menuIdCounter: (prev.menuIdCounter || 0) + 1,
      menuItems: [...(prev.menuItems || []), { ...item, id: (prev.menuIdCounter || 0) + 1 }],
    }));
  }, [setState]);

  const removeMenuItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      menuItems: (prev.menuItems || []).filter((i) => i.id !== id),
    }));
  }, [setState]);

  const updateMenuItem = useCallback((id: number, updates: Partial<MenuItem>) => {
    setState((prev) => ({
      ...prev,
      menuItems: (prev.menuItems || []).map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }, [setState]);

  const toggleMenuItemFavorite = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      menuItems: (prev.menuItems || []).map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i)),
    }));
  }, [setState]);

  const toggleMenuItemChecked = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      menuItems: (prev.menuItems || []).map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    }));
  }, [setState]);

  const updateMenuSettings = useCallback((settings: MenuSettings) => {
    setState((prev) => ({
      ...prev,
      menuSettings: settings,
    }));
  }, [setState]);

  const setGuestMealAssignments = useCallback((assignments: Record<number, number>) => {
    setState((prev) => ({
      ...prev,
      guestMealAssignments: assignments,
    }));
  }, [setState]);

  // Contract Checklist methods
  const toggleContractCheckItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      contractChecklist: {
        ...(prev.contractChecklist || {}),
        [itemId]: !((prev.contractChecklist || {})[itemId]),
      },
    }));
  }, [setState]);

  const clearContractChecklist = useCallback(() => {
    setState((prev) => ({ ...prev, contractChecklist: {} }));
  }, [setState]);

  // Emergency Kit management
  const toggleEmergencyKitItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      emergencyKitChecked: {
        ...(prev.emergencyKitChecked || {}),
        [itemId]: !((prev.emergencyKitChecked || {})[itemId]),
      },
    }));
  }, [setState]);

  const clearEmergencyKitChecklist = useCallback(() => {
    setState((prev) => ({ ...prev, emergencyKitChecked: {} }));
  }, [setState]);

  // Emergency Assistant management (exported for use in components)
  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, "id">) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        emergencyContacts: [...prev.emergencyAssistant.emergencyContacts, { ...contact, id: crypto.randomUUID() }],
      },
    }));
  }, [setState]);

  const removeEmergencyContact = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        emergencyContacts: prev.emergencyAssistant.emergencyContacts.filter(c => c.id !== id),
      },
    }));
  }, [setState]);

  const addTimelineAlert = useCallback((alert: Omit<TimelineAlert, "id">) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        timelineAlerts: [...prev.emergencyAssistant.timelineAlerts, { ...alert, id: crypto.randomUUID() }],
      },
    }));
  }, [setState]);

  const acknowledgeTimelineAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        timelineAlerts: prev.emergencyAssistant.timelineAlerts.map(a => a.id === id ? { ...a, acknowledged: true } : a),
      },
    }));
  }, [setState]);

  const addBackupPlan = useCallback((plan: Omit<BackupPlan, "id">) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        backupPlans: [...prev.emergencyAssistant.backupPlans, { ...plan, id: crypto.randomUUID() }],
      },
    }));
  }, [setState]);

  const activateBackupPlan = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        backupPlans: prev.emergencyAssistant.backupPlans.map(p => p.id === id ? { ...p, activated: true } : p),
      },
    }));
  }, [setState]);

  const addEmergencySupply = useCallback((supply: Omit<EmergencySupply, "id">) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        emergencySupplies: [...prev.emergencyAssistant.emergencySupplies, { ...supply, id: crypto.randomUUID() }],
      },
    }));
  }, [setState]);

  const toggleEmergencySupplyPacked = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: {
        ...prev.emergencyAssistant,
        emergencySupplies: prev.emergencyAssistant.emergencySupplies.map(s =>
          s.id === id ? { ...s, packed: !s.packed } : s
        ),
      },
    }));
  }, [setState]);

  const updateEmergencyAssistant = useCallback((updates: Partial<WeddingState["emergencyAssistant"]>) => {
    setState((prev) => ({
      ...prev,
      emergencyAssistant: { ...prev.emergencyAssistant, ...updates },
    }));
  }, [setState]);

  // Anniversary & Important Dates management
  const addAnniversaryDate = useCallback((date: Omit<ImportantDate, "id">) => {
    setState((prev) => ({
      ...prev,
      anniversaryIdCounter: prev.anniversaryIdCounter + 1,
      anniversaryDates: [...(prev.anniversaryDates || []), { ...date, id: prev.anniversaryIdCounter + 1 }],
    }));
  }, [setState]);

  const updateAnniversaryDate = useCallback((id: number, updates: Partial<ImportantDate>) => {
    setState((prev) => ({
      ...prev,
      anniversaryDates: (prev.anniversaryDates || []).map((d) => d.id === id ? { ...d, ...updates } : d),
    }));
  }, [setState]);

  const removeAnniversaryDate = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      anniversaryDates: (prev.anniversaryDates || []).filter((d) => d.id !== id),
    }));
  }, [setState]);

  // Honeymoon Planner management
  const updateHoneymoon = useCallback((patch: Partial<HoneymoonState>) => {
    setState((prev) => ({
      ...prev,
      honeymoon: { ...(prev.honeymoon ?? DEFAULT_HONEYMOON), ...patch },
    }));
  }, [setState]);

  const toggleHoneymoonPacking = useCallback((itemId: string) => {
    setState((prev) => {
      const base = prev.honeymoon ?? DEFAULT_HONEYMOON;
      const checked = { ...(base.packingChecked || {}) };
      checked[itemId] = !checked[itemId];
      if (!checked[itemId]) delete checked[itemId];
      return { ...prev, honeymoon: { ...base, packingChecked: checked } };
    });
  }, [setState]);

  const clearHoneymoonPacking = useCallback(() => {
    setState((prev) => ({
      ...prev,
      honeymoon: { ...(prev.honeymoon ?? DEFAULT_HONEYMOON), packingChecked: {} },
    }));
  }, [setState]);

  const addHoneymoonTask = useCallback((task: Omit<HoneymoonTask, "id">) => {
    setState((prev) => {
      const base = prev.honeymoon ?? DEFAULT_HONEYMOON;
      const newTask: HoneymoonTask = { ...task, id: base.taskIdCounter + 1 };
      return {
        ...prev,
        honeymoon: { ...base, tasks: [...(base.tasks || []), newTask], taskIdCounter: base.taskIdCounter + 1 },
      };
    });
  }, [setState]);

  const updateHoneymoonTask = useCallback((id: number, updates: Partial<HoneymoonTask>) => {
    setState((prev) => {
      const base = prev.honeymoon ?? DEFAULT_HONEYMOON;
      return {
        ...prev,
        honeymoon: { ...base, tasks: (base.tasks || []).map((t) => t.id === id ? { ...t, ...updates } : t) },
      };
    });
  }, [setState]);

  const removeHoneymoonTask = useCallback((id: number) => {
    setState((prev) => {
      const base = prev.honeymoon ?? DEFAULT_HONEYMOON;
      return {
        ...prev,
        honeymoon: { ...base, tasks: (base.tasks || []).filter((t) => t.id !== id) },
      };
    });
  }, [setState]);

  // Wedding Contracts management
  const addContract = useCallback((contract: Omit<WeddingContract, "id" | "createdAt" | "updatedAt">) => {
    setState((prev) => {
      const newContract: WeddingContract = {
        ...contract,
        id: prev.contractIdCounter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        contracts: [...(prev.contracts || []), newContract],
        contractIdCounter: prev.contractIdCounter + 1,
      };
    });
  }, [setState]);

  const updateContract = useCallback((id: number, updates: Partial<WeddingContract>) => {
    setState((prev) => ({
      ...prev,
      contracts: (prev.contracts || []).map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }));
  }, [setState]);

  const removeContract = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      contracts: (prev.contracts || []).filter((c) => c.id !== id),
    }));
  }, [setState]);

  const addPaymentMilestone = useCallback((contractId: number, milestone: Omit<PaymentMilestone, "id">) => {
    setState((prev) => {
      const contracts = prev.contracts || [];
      const contract = contracts.find((c) => c.id === contractId);
      if (!contract) return prev;

      const newMilestone: PaymentMilestone = {
        ...milestone,
        id: contract.paymentMilestones.length > 0
          ? Math.max(...contract.paymentMilestones.map((m) => m.id)) + 1
          : 1,
      };

      return {
        ...prev,
        contracts: contracts.map((c) =>
          c.id === contractId
            ? { ...c, paymentMilestones: [...c.paymentMilestones, newMilestone], updatedAt: new Date().toISOString() }
            : c
        ),
      };
    });
  }, [setState]);

  const updatePaymentMilestone = useCallback((contractId: number, milestoneId: number, updates: Partial<PaymentMilestone>) => {
    setState((prev) => ({
      ...prev,
      contracts: (prev.contracts || []).map((c) =>
        c.id === contractId
          ? {
              ...c,
              paymentMilestones: c.paymentMilestones.map((m) =>
                m.id === milestoneId ? { ...m, ...updates } : m
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  }, [setState]);

  const removePaymentMilestone = useCallback((contractId: number, milestoneId: number) => {
    setState((prev) => ({
      ...prev,
      contracts: (prev.contracts || []).map((c) =>
        c.id === contractId
          ? {
              ...c,
              paymentMilestones: c.paymentMilestones.filter((m) => m.id !== milestoneId),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  }, [setState]);

  const markPaymentMilestonePaid = useCallback((contractId: number, milestoneId: number) => {
    const now = new Date().toISOString();
    setState((prev) => {
      const contracts = prev.contracts || [];
      const contract = contracts.find((c) => c.id === contractId);
      if (!contract) return prev;

      const milestone = contract.paymentMilestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const updatedMilestone = { ...milestone, status: "paid" as const, paidDate: now };
      const totalPaid = contract.paymentMilestones
        .filter((m) => m.id === milestoneId ? true : m.status === "paid")
        .reduce((sum, m) => sum + (m.id === milestoneId ? updatedMilestone.amount : m.amount), 0);

      return {
        ...prev,
        contracts: contracts.map((c) =>
          c.id === contractId
            ? {
                ...c,
                paymentMilestones: c.paymentMilestones.map((m) =>
                  m.id === milestoneId ? updatedMilestone : m
                ),
                totalPaid,
                updatedAt: now,
              }
            : c
        ),
      };
    });
  }, [setState]);

  // Hashtag Generator methods
  const setGeneratedHashtags = useCallback((hashtags: string[]) => {
    setState((prev) => ({ ...prev, generatedHashtags: hashtags }));
  }, [setState]);

  const toggleFavoriteHashtag = useCallback((tag: string) => {
    setState((prev) => {
      const favorites = prev.favoriteHashtags || [];
      const index = favorites.indexOf(tag);
      if (index > -1) {
        return { ...prev, favoriteHashtags: favorites.filter(t => t !== tag) };
      } else {
        return { ...prev, favoriteHashtags: [...favorites, tag] };
      }
    });
  }, [setState]);

  const clearGeneratedHashtags = useCallback(() => {
    setState((prev) => ({ ...prev, generatedHashtags: [] }));
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
    addVendor, removeVendor, updateVendor, addVendorQuote, updateVendorQuote, removeVendorQuote, addPhoto, removePhoto,
    setLang, setRegion, setPartyTime, setStepStartTime, setEnabledSteps,
    completeOnboarding, getProgress, setRsvpSettings, updateGuestRsvpToken,
    addExpense, updateExpense, removeExpense,
    toggleChecklistItem,
    toggleKitItem, addCustomKitItem, removeCustomKitItem,
    addSeatingTable, updateSeatingTable, removeSeatingTable,
    assignGuestToTable, unassignGuest,
    setItineraryItems, addItineraryItem, updateItineraryItem, removeItineraryItem,
    addContact, updateContact, removeContact,
    addVendorPayment, updateVendorPayment, removeVendorPayment,
    addVendorCommunication, updateVendorCommunication, removeVendorCommunication,
    addVendorGratitude, updateVendorGratitude, removeVendorGratitude,
    addReview, updateReview, deleteReview, getVendorReviews,
    addSong, updateSong, removeSong,
    addSpeech, updateSpeech, removeSpeech,
    addGuestBookEntry, updateGuestBookEntry, removeGuestBookEntry, toggleGuestBookFavorite,
    addPartyMember, updatePartyMember, removePartyMember,
    addMoodBoardItem, updateMoodBoardItem, removeMoodBoardItem, toggleMoodBoardFavorite,
    addColorPalette, updateColorPalette, removeColorPalette,
    addQuickNote, toggleQuickNote, removeQuickNote,
    addRegistryItem, updateRegistryItem, removeRegistryItem, toggleRegistryFulfilled,
    addTransportationGroup, updateTransportationGroup, removeTransportationGroup,
    assignGuestToTransport, unassignGuestFromTransport,
    addGuestGift, updateGuestGift, removeGuestGift, markGiftDistributed,
    addPhotoShot, removePhotoShot, updatePhotoShot,
    addWelcomeBagItem, removeWelcomeBagItem, updateWelcomeBagItem, toggleWelcomeBagItemChecked,
    addWelcomeBagDistribution, removeWelcomeBagDistribution, updateWelcomeBagDistribution,
    addMenuItem, removeMenuItem, updateMenuItem, toggleMenuItemFavorite, toggleMenuItemChecked, updateMenuSettings, setGuestMealAssignments,
    toggleContractCheckItem, clearContractChecklist,
    addContract, updateContract, removeContract,
    addPaymentMilestone, updatePaymentMilestone, removePaymentMilestone, markPaymentMilestonePaid,
    setGeneratedHashtags, toggleFavoriteHashtag, clearGeneratedHashtags,
    toggleEmergencyKitItem, clearEmergencyKitChecklist,
    addAnniversaryDate, updateAnniversaryDate, removeAnniversaryDate,
    updateHoneymoon, toggleHoneymoonPacking, clearHoneymoonPacking,
    addHoneymoonTask, updateHoneymoonTask, removeHoneymoonTask,
    // Emergency Assistant methods
    addEmergencyContact, removeEmergencyContact, addTimelineAlert, acknowledgeTimelineAlert,
    addBackupPlan, activateBackupPlan, addEmergencySupply, toggleEmergencySupplyPacked, updateEmergencyAssistant,
    ...phase2,
  };
}

export type WeddingStore = ReturnType<typeof useWeddingStore>;
