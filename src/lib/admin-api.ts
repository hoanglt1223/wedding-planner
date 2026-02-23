const BASE = "/api/admin";

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/login`, {
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
    await fetch(`${BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore
  }
}

export async function adminVerify(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/verify`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json() as { authenticated?: boolean };
    return data.authenticated === true;
  } catch {
    return false;
  }
}
