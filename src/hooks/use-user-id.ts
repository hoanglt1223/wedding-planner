const STORAGE_KEY = "wp_user_id";

/**
 * Returns a stable anonymous UUID for this browser session.
 * Generated once via crypto.randomUUID(), persisted in localStorage.
 * Does NOT use React state -- the ID is stable and never changes.
 */
export function useUserId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}
