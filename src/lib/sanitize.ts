/**
 * XSS koruması: HTML etiketlerini temizler.
 * React metin render'ı zaten escape eder; entity encode çift kaçışa yol açmasın diye
 * yalnızca etiket/script kalıntıları temizlenir.
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function sanitizeString(input: string): string {
  return stripHtml(input).replace(/\0/g, "").trim();
}
