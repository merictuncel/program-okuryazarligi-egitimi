/**
 * Duyuru bağlantıları: yalnızca allowlist’teki dahili yollar.
 * javascript:, //evil.com, harici URL vb. reddedilir.
 */
export const SAFE_INTERNAL_PATHS = [
  "/",
  "/program",
  "/hakkinda",
  "/egitmenler",
  "/duyurular",
  "/iletisim",
  "/basvuru-kosullari",
  "/sss",
  "/kvkk",
  "/belgeler",
  "/ulasim",
  "/galeri",
] as const;

export type SafeInternalPath = (typeof SAFE_INTERNAL_PATHS)[number];

export function isSafeInternalPath(value: string | null | undefined): value is SafeInternalPath {
  if (!value) return false;
  return (SAFE_INTERNAL_PATHS as readonly string[]).includes(value);
}

export function normalizeLinkPath(
  value: string | null | undefined,
): SafeInternalPath | null {
  if (!value || value.trim() === "") return null;
  const trimmed = value.trim();
  if (!isSafeInternalPath(trimmed)) return null;
  return trimmed;
}

export const LINK_PATH_LABELS: Record<SafeInternalPath, string> = {
  "/": "Ana Sayfa",
  "/program": "Program",
  "/hakkinda": "Hakkında",
  "/egitmenler": "Eğitmenler",
  "/duyurular": "Duyurular",
  "/iletisim": "İletişim",
  "/basvuru-kosullari": "Başvuru Koşulları",
  "/sss": "SSS",
  "/kvkk": "KVKK",
  "/belgeler": "Belgeler",
  "/ulasim": "Ulaşım & Konaklama",
  "/galeri": "Galeri",
};
