/**
 * Başvuru formu henüz açılmadıysa (#, boş, null) false döner.
 * Proje desteklenmesi halinde gerçek Google Form URL'si girildiğinde true olur.
 */
export function isApplicationOpen(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#" || trimmed === "/") return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
