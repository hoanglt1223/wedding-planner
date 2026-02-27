/**
 * Client-side API helpers for photo wall feature.
 */

export interface PhotoMeta {
  id: string;
  uploaderName: string | null;
  blobUrl: string;
  thumbnailUrl: string | null;
  tableGroup: string | null;
  approved: boolean;
  createdAt: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown_error" }));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createPhotoToken(userId: string): Promise<string> {
  const data = await apiFetch<{ token: string }>("/api/photos?action=create-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return data.token;
}

export async function getUploadUrl(
  token: string,
  filename: string,
): Promise<{ clientToken: string; pathname: string }> {
  return apiFetch<{ clientToken: string; pathname: string }>("/api/photos?action=get-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, filename }),
  });
}

export async function confirmUpload(
  token: string,
  blobUrl: string,
  uploaderName: string,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/api/photos?action=confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, blobUrl, uploaderName }),
  });
}

export async function fetchPhotos(
  userId: string,
): Promise<{ photos: PhotoMeta[] }> {
  return apiFetch<{ photos: PhotoMeta[] }>(`/api/photos?userId=${encodeURIComponent(userId)}`);
}

export async function moderatePhoto(
  userId: string,
  photoId: string,
  approved: boolean,
): Promise<void> {
  await apiFetch<{ ok: boolean }>("/api/photos?action=moderate", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, photoId, approved }),
  });
}
