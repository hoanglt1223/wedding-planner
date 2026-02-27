const ADMIN = "/api/admin";

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${ADMIN}?action=login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json() as { ok?: boolean; error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? "login_failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "network_error" };
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${ADMIN}?action=logout`, { method: "POST", credentials: "include" });
  } catch { /* ignore */ }
}

export async function adminVerify(): Promise<boolean> {
  try {
    const res = await fetch(`${ADMIN}?action=verify`, { method: "GET", credentials: "include" });
    if (!res.ok) return false;
    const data = await res.json() as { authenticated?: boolean };
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export function adminDataUrl(action: string, params?: Record<string, string>): string {
  const sp = new URLSearchParams({ action, ...params });
  return `${ADMIN}?${sp}`;
}
