import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getInstructors() {
  return prisma.instructor.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getActiveAnnouncements(limit?: number) {
  return prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

/** En güncel aktif popup duyurusu (tek modal) */
export async function getPopupAnnouncement() {
  return prisma.announcement.findFirst({
    where: { isActive: true, showAsPopup: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getActiveProgramSessions() {
  return prisma.programSession.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllProgramSessions() {
  return prisma.programSession.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getActiveFaqItems() {
  return prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllFaqItems() {
  return prisma.faqItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getActiveDocuments() {
  return prisma.siteDocument.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllDocuments() {
  return prisma.siteDocument.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getActiveGalleryImages() {
  return prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export { formatDateRange, formatDateTr } from "@/lib/format";
