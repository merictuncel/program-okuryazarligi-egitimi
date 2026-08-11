import { z } from "zod";
import { sanitizeString, stripHtml } from "@/lib/sanitize";
import { SAFE_INTERNAL_PATHS } from "@/lib/links";

const safeText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Bu alan zorunludur")
    .max(max, `En fazla ${max} karakter olabilir`)
    .transform((v) => sanitizeString(stripHtml(v)));

const optionalSafeText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => {
      if (!v) return v ?? null;
      return sanitizeString(stripHtml(v));
    });

/** Harici URL veya /uploads/... yerel yol */
const optionalPhotoUrl = z
  .union([
    z.literal("").transform(() => null),
    z.null(),
    z.undefined(),
    z
      .string()
      .trim()
      .max(2048)
      .refine(
        (v) =>
          v.startsWith("/uploads/") ||
          /^https?:\/\//i.test(v),
        "Geçerli bir URL veya /uploads/ yolu giriniz",
      ),
  ])
  .optional()
  .nullable();

const optionalUrl = z
  .union([
    z.literal(""),
    z.literal("#"),
    z.null(),
    z.undefined(),
    z.string().trim().url("Geçerli bir URL giriniz").max(2048),
  ])
  .optional()
  .nullable()
  .transform((v) => {
    if (v === "" || v === undefined) return null;
    return v ?? null;
  });

const booleanFromForm = z
  .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("on")])
  .transform((v) => v === true || v === "true" || v === "on");

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta giriniz")
    .max(255)
    .transform((v) => v.toLowerCase()),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").max(128),
});

const optionalEmail = z
  .union([
    z.literal(""),
    z.null(),
    z.undefined(),
    z
      .string()
      .trim()
      .email("Geçerli bir e-posta giriniz")
      .max(255)
      .transform((v) => v.toLowerCase()),
  ])
  .optional()
  .nullable()
  .transform((v) => {
    if (v === "" || v === undefined) return null;
    return v ?? null;
  });

export const siteSettingsSchema = z.object({
  title: safeText(200),
  purpose: safeText(5000),
  scope: safeText(5000),
  startDate: optionalSafeText(50),
  endDate: optionalSafeText(50),
  location: optionalSafeText(300),
  organizingCommittee: optionalSafeText(5000),
  scientificCommittee: optionalSafeText(5000),
  applicationFormUrl: optionalUrl,
  contactName: optionalSafeText(150),
  contactTitle: optionalSafeText(200),
  contactRole: optionalSafeText(200),
  contactEmail: optionalEmail,
  contactPhone: optionalSafeText(50),
  contactInstitution: optionalSafeText(400),
  contactNote: optionalSafeText(2000),
  applicationCriteria: optionalSafeText(20000),
  kvkkText: optionalSafeText(20000),
  travelInfo: optionalSafeText(20000),
  certificateInfo: optionalSafeText(5000),
});

export const instructorSchema = z.object({
  name: safeText(150),
  title: safeText(200),
  biography: safeText(5000),
  photoUrl: optionalPhotoUrl,
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const instructorUpdateSchema = instructorSchema.partial();

export const announcementSchema = z.object({
  title: safeText(300),
  content: safeText(10000),
  publishedAt: z.coerce.date().optional(),
  isActive: booleanFromForm.default(true),
  showAsPopup: booleanFromForm.default(false),
  linkPath: z
    .union([z.literal(""), z.null(), z.undefined(), z.string().trim().max(64)])
    .optional()
    .nullable()
    .transform((v) => {
      if (!v || v === "") return null;
      const allowed = SAFE_INTERNAL_PATHS as readonly string[];
      return allowed.includes(v) ? v : null;
    }),
});

export const announcementUpdateSchema = announcementSchema.partial();

export const programSessionSchema = z.object({
  dayLabel: safeText(120),
  title: safeText(300),
  instructorName: optionalSafeText(150),
  timeLabel: optionalSafeText(80),
  location: optionalSafeText(200),
  description: optionalSafeText(5000),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  isActive: booleanFromForm.default(true),
});

export const programSessionUpdateSchema = programSessionSchema.partial();

export const faqItemSchema = z.object({
  question: safeText(500),
  answer: safeText(10000),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  isActive: booleanFromForm.default(true),
});

export const faqItemUpdateSchema = faqItemSchema.partial();

export const siteDocumentSchema = z.object({
  title: safeText(300),
  description: optionalSafeText(2000),
  fileUrl: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .refine(
      (v) =>
        v.startsWith("/uploads/documents/") ||
        v.startsWith("/api/uploads/documents/") ||
        /^https:\/\/.+\.blob\.vercel-storage\.com\//i.test(v),
      "Geçerli bir belge yolu veya URL giriniz",
    ),
  fileName: optionalSafeText(255),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  isActive: booleanFromForm.default(true),
});

export const siteDocumentUpdateSchema = siteDocumentSchema.partial();

export const galleryImageSchema = z.object({
  title: optionalSafeText(200),
  caption: optionalSafeText(1000),
  imageUrl: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .refine(
      (v) =>
        v.startsWith("/uploads/gallery/") ||
        v.startsWith("/api/uploads/gallery/") ||
        /^https:\/\/.+\.blob\.vercel-storage\.com\//i.test(v),
      "Geçerli bir galeri görseli yolu veya URL giriniz",
    ),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  isActive: booleanFromForm.default(true),
});

export const galleryImageUpdateSchema = galleryImageSchema.partial();

export type LoginInput = z.infer<typeof loginSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type InstructorInput = z.infer<typeof instructorSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type ProgramSessionInput = z.infer<typeof programSessionSchema>;
export type FaqItemInput = z.infer<typeof faqItemSchema>;
export type SiteDocumentInput = z.infer<typeof siteDocumentSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
