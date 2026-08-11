"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveGalleryImage, saveInstructorPhoto, saveSiteDocument } from "@/lib/upload";
import { deleteLocalUpload } from "@/lib/files";
import {
  announcementSchema,
  announcementUpdateSchema,
  faqItemSchema,
  faqItemUpdateSchema,
  galleryImageSchema,
  galleryImageUpdateSchema,
  instructorSchema,
  instructorUpdateSchema,
  programSessionSchema,
  programSessionUpdateSchema,
  siteDocumentSchema,
  siteDocumentUpdateSchema,
  siteSettingsSchema,
} from "@/lib/validations";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/hakkinda");
  revalidatePath("/egitmenler");
  revalidatePath("/iletisim");
  revalidatePath("/duyurular");
  revalidatePath("/program");
  revalidatePath("/basvuru-kosullari");
  revalidatePath("/sss");
  revalidatePath("/kvkk");
  revalidatePath("/belgeler");
  revalidatePath("/ulasim");
  revalidatePath("/galeri");
}

async function requireAdmin(): Promise<ActionResult | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Yetkisiz erişim." };
  }
  return null;
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function updateSiteSettingsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = siteSettingsSchema.safeParse({
    title: formString(formData, "title"),
    purpose: formString(formData, "purpose"),
    scope: formString(formData, "scope"),
    startDate: formString(formData, "startDate") || null,
    endDate: formString(formData, "endDate") || null,
    location: formString(formData, "location") || null,
    organizingCommittee: formString(formData, "organizingCommittee") || null,
    scientificCommittee: formString(formData, "scientificCommittee") || null,
    applicationFormUrl: formString(formData, "applicationFormUrl") || null,
    contactName: formString(formData, "contactName") || null,
    contactTitle: formString(formData, "contactTitle") || null,
    contactRole: formString(formData, "contactRole") || null,
    contactEmail: formString(formData, "contactEmail") || null,
    contactPhone: formString(formData, "contactPhone") || null,
    contactInstitution: formString(formData, "contactInstitution") || null,
    contactNote: formString(formData, "contactNote") || null,
    applicationCriteria: formString(formData, "applicationCriteria") || null,
    kvkkText: formString(formData, "kvkkText") || null,
    travelInfo: formString(formData, "travelInfo") || null,
    certificateInfo: formString(formData, "certificateInfo") || null,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data: parsed.data,
    });
  } else {
    await prisma.siteSettings.create({ data: parsed.data });
  }

  revalidatePublicSite();
  revalidatePath("/admin/settings");

  return { success: true, message: "Site ayarları güncellendi." };
}

const applicationPageSchema = z.object({
  applicationFormUrl: siteSettingsSchema.shape.applicationFormUrl,
  applicationCriteria: siteSettingsSchema.shape.applicationCriteria,
});

export async function updateApplicationPageAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = applicationPageSchema.safeParse({
    applicationFormUrl: formString(formData, "applicationFormUrl") || null,
    applicationCriteria: formString(formData, "applicationCriteria") || null,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.siteSettings.findFirst();
  if (!existing) {
    return {
      success: false,
      message: "Önce Site Ayarları’ndan temel bilgileri kaydedin.",
    };
  }

  await prisma.siteSettings.update({
    where: { id: existing.id },
    data: parsed.data,
  });

  revalidatePublicSite();
  revalidatePath("/admin/basvuru");
  revalidatePath("/admin/settings");

  return { success: true, message: "Başvuru sayfası güncellendi." };
}

export async function createInstructorAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  let photoUrl: string | null = formString(formData, "photoUrl") || null;
  const photo = formData.get("photo");

  if (photo instanceof File && photo.size > 0) {
    try {
      photoUrl = await saveInstructorPhoto(photo);
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Yükleme hatası.",
      };
    }
  }

  const parsed = instructorSchema.safeParse({
    name: formString(formData, "name"),
    title: formString(formData, "title"),
    biography: formString(formData, "biography"),
    photoUrl,
    order: formString(formData, "order") || "0",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.instructor.create({ data: parsed.data });

  revalidatePublicSite();
  revalidatePath("/admin/instructors");

  return { success: true, message: "Eğitmen eklendi." };
}

export async function updateInstructorAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = formString(formData, "id");
  if (!id) {
    return { success: false, message: "Eğitmen kimliği gerekli." };
  }

  let photoUrl: string | null | undefined = undefined;
  const existingPhoto = formString(formData, "photoUrl");
  if (existingPhoto) photoUrl = existingPhoto;

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      photoUrl = await saveInstructorPhoto(photo);
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Yükleme hatası.",
      };
    }
  }

  const parsed = instructorUpdateSchema.safeParse({
    name: formString(formData, "name"),
    title: formString(formData, "title"),
    biography: formString(formData, "biography"),
    photoUrl,
    order: formString(formData, "order") || "0",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.instructor.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: "Eğitmen bulunamadı." };
    }

    const updated = await prisma.instructor.update({
      where: { id },
      data: parsed.data,
    });

    if (
      photo instanceof File &&
      photo.size > 0 &&
      existing.photoUrl &&
      existing.photoUrl !== updated.photoUrl
    ) {
      await deleteLocalUpload(existing.photoUrl);
    }
  } catch {
    return { success: false, message: "Eğitmen bulunamadı." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/instructors");

  return { success: true, message: "Eğitmen güncellendi." };
}

export async function deleteInstructorAction(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const existing = await prisma.instructor.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: "Eğitmen silinemedi." };
    }
    await prisma.instructor.delete({ where: { id } });
    await deleteLocalUpload(existing.photoUrl);
  } catch {
    return { success: false, message: "Eğitmen silinemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/instructors");

  return { success: true, message: "Eğitmen silindi." };
}

export async function createAnnouncementAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = announcementSchema.safeParse({
    title: formString(formData, "title"),
    content: formString(formData, "content"),
    isActive: formData.get("isActive") ? "true" : "false",
    showAsPopup: formData.get("showAsPopup") ? "true" : "false",
    linkPath: formString(formData, "linkPath") || null,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Aynı anda tek popup: yeni popup açılınca diğerlerini kapat
  if (parsed.data.showAsPopup) {
    await prisma.announcement.updateMany({
      where: { showAsPopup: true },
      data: { showAsPopup: false },
    });
  }

  await prisma.announcement.create({
    data: {
      ...parsed.data,
      publishedAt: new Date(),
    },
  });

  revalidatePublicSite();
  revalidatePath("/admin/announcements");

  return { success: true, message: "Duyuru yayınlandı." };
}

export async function deleteAnnouncementAction(
  id: string,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await prisma.announcement.delete({ where: { id } });
  } catch {
    return { success: false, message: "Duyuru silinemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/announcements");

  return { success: true, message: "Duyuru silindi." };
}

export async function updateAnnouncementAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = formString(formData, "id");
  if (!id) {
    return { success: false, message: "Duyuru kimliği gerekli." };
  }

  const parsed = announcementUpdateSchema.safeParse({
    title: formString(formData, "title"),
    content: formString(formData, "content"),
    isActive: formData.get("isActive") ? "true" : "false",
    showAsPopup: formData.get("showAsPopup") ? "true" : "false",
    linkPath: formString(formData, "linkPath") || null,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    if (parsed.data.showAsPopup) {
      await prisma.announcement.updateMany({
        where: { showAsPopup: true, NOT: { id } },
        data: { showAsPopup: false },
      });
    }

    await prisma.announcement.update({
      where: { id },
      data: parsed.data,
    });
  } catch {
    return { success: false, message: "Duyuru güncellenemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/announcements");

  return { success: true, message: "Duyuru güncellendi." };
}

export async function createProgramSessionAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = programSessionSchema.safeParse({
    dayLabel: formString(formData, "dayLabel"),
    title: formString(formData, "title"),
    instructorName: formString(formData, "instructorName") || null,
    timeLabel: formString(formData, "timeLabel") || null,
    location: formString(formData, "location") || null,
    description: formString(formData, "description") || null,
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.programSession.create({ data: parsed.data });

  revalidatePublicSite();
  revalidatePath("/admin/program");

  return { success: true, message: "Program oturumu eklendi." };
}

export async function updateProgramSessionAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = formString(formData, "id");
  if (!id) {
    return { success: false, message: "Oturum kimliği gerekli." };
  }

  const parsed = programSessionUpdateSchema.safeParse({
    dayLabel: formString(formData, "dayLabel"),
    title: formString(formData, "title"),
    instructorName: formString(formData, "instructorName") || null,
    timeLabel: formString(formData, "timeLabel") || null,
    location: formString(formData, "location") || null,
    description: formString(formData, "description") || null,
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.programSession.update({
      where: { id },
      data: parsed.data,
    });
  } catch {
    return { success: false, message: "Oturum güncellenemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/program");

  return { success: true, message: "Program oturumu güncellendi." };
}

export async function deleteProgramSessionAction(
  id: string,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await prisma.programSession.delete({ where: { id } });
  } catch {
    return { success: false, message: "Oturum silinemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/program");

  return { success: true, message: "Program oturumu silindi." };
}

export async function createFaqItemAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = faqItemSchema.safeParse({
    question: formString(formData, "question"),
    answer: formString(formData, "answer"),
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.faqItem.create({ data: parsed.data });

  revalidatePublicSite();
  revalidatePath("/admin/faq");

  return { success: true, message: "SSS maddesi eklendi." };
}

export async function updateFaqItemAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = formString(formData, "id");
  if (!id) {
    return { success: false, message: "SSS kimliği gerekli." };
  }

  const parsed = faqItemUpdateSchema.safeParse({
    question: formString(formData, "question"),
    answer: formString(formData, "answer"),
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.faqItem.update({
      where: { id },
      data: parsed.data,
    });
  } catch {
    return { success: false, message: "SSS güncellenemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/faq");

  return { success: true, message: "SSS maddesi güncellendi." };
}

export async function deleteFaqItemAction(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await prisma.faqItem.delete({ where: { id } });
  } catch {
    return { success: false, message: "SSS silinemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/faq");

  return { success: true, message: "SSS maddesi silindi." };
}

export async function createDocumentAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "PDF dosyası zorunludur." };
  }

  let fileUrl: string;
  let fileName: string;
  try {
    const saved = await saveSiteDocument(file);
    fileUrl = saved.fileUrl;
    fileName = saved.fileName;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Yükleme hatası.",
    };
  }

  const parsed = siteDocumentSchema.safeParse({
    title: formString(formData, "title"),
    description: formString(formData, "description") || null,
    fileUrl,
    fileName,
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    await deleteLocalUpload(fileUrl);
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.siteDocument.create({ data: parsed.data });

  revalidatePublicSite();
  revalidatePath("/admin/documents");

  return { success: true, message: "Belge eklendi." };
}

export async function updateDocumentAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = formString(formData, "id");
  if (!id) {
    return { success: false, message: "Belge kimliği gerekli." };
  }

  const existing = await prisma.siteDocument.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Belge bulunamadı." };
  }

  let fileUrl = existing.fileUrl;
  let fileName = existing.fileName;
  const file = formData.get("file");
  let uploadedNew = false;

  if (file instanceof File && file.size > 0) {
    try {
      const saved = await saveSiteDocument(file);
      fileUrl = saved.fileUrl;
      fileName = saved.fileName;
      uploadedNew = true;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Yükleme hatası.",
      };
    }
  }

  const parsed = siteDocumentUpdateSchema.safeParse({
    title: formString(formData, "title"),
    description: formString(formData, "description") || null,
    fileUrl,
    fileName,
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    if (uploadedNew) await deleteLocalUpload(fileUrl);
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.siteDocument.update({
      where: { id },
      data: parsed.data,
    });
    if (uploadedNew && existing.fileUrl !== fileUrl) {
      await deleteLocalUpload(existing.fileUrl);
    }
  } catch {
    if (uploadedNew) await deleteLocalUpload(fileUrl);
    return { success: false, message: "Belge güncellenemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/documents");

  return { success: true, message: "Belge güncellendi." };
}

export async function deleteDocumentAction(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const existing = await prisma.siteDocument.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: "Belge silinemedi." };
    }
    await prisma.siteDocument.delete({ where: { id } });
    await deleteLocalUpload(existing.fileUrl);
  } catch {
    return { success: false, message: "Belge silinemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/documents");

  return { success: true, message: "Belge silindi." };
}

export async function createGalleryImageAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Görsel dosyası zorunludur." };
  }

  let imageUrl: string;
  try {
    imageUrl = await saveGalleryImage(file);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Yükleme hatası.",
    };
  }

  const parsed = galleryImageSchema.safeParse({
    title: formString(formData, "title") || null,
    caption: formString(formData, "caption") || null,
    imageUrl,
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    await deleteLocalUpload(imageUrl);
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.galleryImage.create({ data: parsed.data });

  revalidatePublicSite();
  revalidatePath("/admin/gallery");

  return { success: true, message: "Galeri görseli eklendi." };
}

export async function updateGalleryImageAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = formString(formData, "id");
  if (!id) {
    return { success: false, message: "Görsel kimliği gerekli." };
  }

  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Görsel bulunamadı." };
  }

  let imageUrl = existing.imageUrl;
  const file = formData.get("image");
  let uploadedNew = false;

  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveGalleryImage(file);
      uploadedNew = true;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Yükleme hatası.",
      };
    }
  }

  const parsed = galleryImageUpdateSchema.safeParse({
    title: formString(formData, "title") || null,
    caption: formString(formData, "caption") || null,
    imageUrl,
    order: formString(formData, "order") || "0",
    isActive: formData.get("isActive") ? "true" : "false",
  });

  if (!parsed.success) {
    if (uploadedNew) await deleteLocalUpload(imageUrl);
    return {
      success: false,
      message: "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.galleryImage.update({
      where: { id },
      data: parsed.data,
    });
    if (uploadedNew && existing.imageUrl !== imageUrl) {
      await deleteLocalUpload(existing.imageUrl);
    }
  } catch {
    if (uploadedNew) await deleteLocalUpload(imageUrl);
    return { success: false, message: "Görsel güncellenemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/gallery");

  return { success: true, message: "Galeri görseli güncellendi." };
}

export async function deleteGalleryImageAction(
  id: string,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: "Görsel silinemedi." };
    }
    await prisma.galleryImage.delete({ where: { id } });
    await deleteLocalUpload(existing.imageUrl);
  } catch {
    return { success: false, message: "Görsel silinemedi." };
  }

  revalidatePublicSite();
  revalidatePath("/admin/gallery");

  return { success: true, message: "Galeri görseli silindi." };
}

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6).max(128),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalıdır").max(128),
  confirmPassword: z.string().min(8).max(128),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Yeni şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

export async function changePasswordAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return { success: false, message: "Oturum bulunamadı." };
  }

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formString(formData, "currentPassword"),
    newPassword: formString(formData, "newPassword"),
    confirmPassword: formString(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Doğrulama hatası.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, message: "Kullanıcı bulunamadı." };
  }

  const valid = await compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return { success: false, message: "Mevcut şifre hatalı." };
  }

  const passwordHash = await hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: passwordHash },
  });

  return { success: true, message: "Şifre güncellendi." };
}
