import { useCallback } from "react";
import type {
  WeddingState, TimelineEntry, GiftEntry,
  WebsiteSettings, PhotoWallSettings, TaskBoardSettings,
} from "@/types/wedding";
import { DEFAULT_STATE } from "@/data/backgrounds";

type SetState = (fn: (prev: WeddingState) => WeddingState) => void;

export function usePhase2Methods(setState: SetState) {
  // Timeline methods
  const addTimelineEntry = useCallback((entry: Omit<TimelineEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      timelineIdCounter: prev.timelineIdCounter + 1,
      timelineEntries: [...prev.timelineEntries, { ...entry, id: prev.timelineIdCounter + 1 }],
    }));
  }, [setState]);

  const updateTimelineEntry = useCallback((id: number, updates: Partial<TimelineEntry>) => {
    setState((prev) => ({
      ...prev,
      timelineEntries: prev.timelineEntries.map((e) => e.id === id ? { ...e, ...updates } : e),
    }));
  }, [setState]);

  const removeTimelineEntry = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      timelineEntries: prev.timelineEntries.filter((e) => e.id !== id),
    }));
  }, [setState]);

  const setTimelineEntries = useCallback((entries: TimelineEntry[]) => {
    setState((prev) => ({ ...prev, timelineEntries: entries }));
  }, [setState]);

  // Gift methods
  const addGift = useCallback((gift: Omit<GiftEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      giftIdCounter: prev.giftIdCounter + 1,
      gifts: [...prev.gifts, { ...gift, id: prev.giftIdCounter + 1 }],
    }));
  }, [setState]);

  const updateGift = useCallback((id: number, updates: Partial<GiftEntry>) => {
    setState((prev) => ({
      ...prev,
      gifts: prev.gifts.map((g) => g.id === id ? { ...g, ...updates } : g),
    }));
  }, [setState]);

  const removeGift = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      gifts: prev.gifts.filter((g) => g.id !== id),
    }));
  }, [setState]);

  // Settings methods
  const setWebsiteSettings = useCallback((settings: Partial<WebsiteSettings>) => {
    setState((prev) => ({
      ...prev,
      websiteSettings: { ...(prev.websiteSettings || DEFAULT_STATE.websiteSettings), ...settings },
    }));
  }, [setState]);

  const setPhotoWallSettings = useCallback((settings: Partial<PhotoWallSettings>) => {
    setState((prev) => ({
      ...prev,
      photoWallSettings: { ...(prev.photoWallSettings || DEFAULT_STATE.photoWallSettings), ...settings },
    }));
  }, [setState]);

  const setTaskBoardSettings = useCallback((settings: Partial<TaskBoardSettings>) => {
    setState((prev) => ({
      ...prev,
      taskBoardSettings: { ...(prev.taskBoardSettings || DEFAULT_STATE.taskBoardSettings), ...settings },
    }));
  }, [setState]);

  const dismissReminder = useCallback((reminderId: string) => {
    setState((prev) => ({
      ...prev,
      dismissedReminders: [...(prev.dismissedReminders || []), reminderId],
    }));
  }, [setState]);

  return {
    addTimelineEntry, updateTimelineEntry, removeTimelineEntry, setTimelineEntries,
    addGift, updateGift, removeGift,
    setWebsiteSettings, setPhotoWallSettings, setTaskBoardSettings,
    dismissReminder,
  };
}
