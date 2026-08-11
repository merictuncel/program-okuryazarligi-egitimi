export function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
) {
  if (startDate && endDate) return `${startDate} – ${endDate}`;
  return startDate || endDate || null;
}

export function formatDateTr(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
