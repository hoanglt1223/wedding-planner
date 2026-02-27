/**
 * Vietnamese-aware slug generation for wedding website URLs.
 */

/** Generate a URL slug from bride and groom names. */
export function generateSlug(bride: string, groom: string): string {
  const combined = `${groom}-${bride}`;
  return combined
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Validate slug format: starts and ends with alphanumeric,
 * 3-52 chars total (at least 2 chars for inner portion).
 */
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,50}[a-z0-9]$/.test(slug);
}
