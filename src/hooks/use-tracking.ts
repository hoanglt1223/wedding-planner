import { useEffect, useRef, useCallback } from "react";

interface TrackEvent {
  type: string;
  data?: unknown;
  timestamp: string;
}

export function useTracking(userId: string) {
  const bufferRef = useRef<TrackEvent[]>([]);
  const timerRef = useRef<number>(undefined);

  const flush = useCallback(
    (beacon?: boolean) => {
      if (bufferRef.current.length === 0) return;
      const events = bufferRef.current.splice(0);
      const payload = JSON.stringify({ userId, events });

      if (beacon && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track", {
          method: "POST",
          body: payload,
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }
    },
    [userId]
  );

  const track = useCallback(
    (type: string, data?: unknown) => {
      bufferRef.current.push({ type, data, timestamp: new Date().toISOString() });
      if (bufferRef.current.length >= 20) flush();
    },
    [flush]
  );

  useEffect(() => {
    timerRef.current = window.setInterval(() => flush(), 30_000);

    const onVisibility = () => { if (document.hidden) flush(true); };
    const onUnload = () => flush(true);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [flush]);

  return { track };
}
