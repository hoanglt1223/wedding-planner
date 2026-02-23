import { useEffect, useRef } from "react";
import type { WeddingState } from "@/types/wedding";

interface UseSyncParams {
  userId: string;
  state: WeddingState;
  progress: number;
}

const DEBOUNCE_MS = 5_000;
const HEARTBEAT_MS = 300_000; // 5 minutes

/**
 * Syncs wedding state to /api/sync with debounce, visibility change,
 * periodic heartbeat, and sendBeacon on unload.
 */
export function useSync({ userId, state, progress }: UseSyncParams): void {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSyncedRef = useRef<string>("");

  function buildPayload() {
    return JSON.stringify({ userId, data: state, progress });
  }

  function doSync(beacon = false): void {
    const payload = buildPayload();
    if (payload === lastSyncedRef.current) return; // skip identical

    if (beacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/sync", blob);
      lastSyncedRef.current = payload;
      return;
    }

    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((res) => {
        if (res.ok) lastSyncedRef.current = payload;
      })
      .catch(() => {
        // silent failure -- sync is best-effort
      });
  }

  // Debounced sync on state changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSync(), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, progress]);

  // Immediate sync on visibility hidden
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") doSync();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, progress, userId]);

  // Heartbeat every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => doSync(), HEARTBEAT_MS);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, progress, userId]);

  // sendBeacon on unload
  useEffect(() => {
    function onUnload() {
      doSync(true);
    }
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, progress, userId]);
}
