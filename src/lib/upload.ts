import { randomUUID } from "crypto";
import sharp from "sharp";
import { saveUploadBuffer } from "@/lib/storage";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_GALLERY_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const OUTPUT_SIZE = 800;
/** Galeri kart oranı 4:3 */
const GALLERY_CARD_WIDTH = 1200;
const GALLERY_CARD_HEIGHT = 900;

export async function saveInstructorPhoto(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Yalnızca JPEG, PNG, WEBP veya GIF yüklenebilir.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Dosya boyutu 8 MB'den büyük olamaz.");
  }

  const filename = `${randomUUID()}.jpg`;
  const input = Buffer.from(await file.arrayBuffer());

  const output = await sharp(input)
    .rotate()
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
      fit: "cover",
      position: "attention",
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  return saveUploadBuffer({
    kind: "instructors",
    filename,
    buffer: output,
    contentType: "image/jpeg",
  });
}

export async function saveSiteDocument(
  file: File,
): Promise<{ fileUrl: string; fileName: string }> {
  if (file.type !== "application/pdf") {
    throw new Error("Yalnızca PDF dosyası yüklenebilir (application/pdf).");
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Dosya boyutu 10 MB'den büyük olamaz.");
  }

  const safeBase =
    file.name
      .replace(/[^a-zA-Z0-9._-ğüşıöçĞÜŞİÖÇ ]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "belge";
  const filename = `${randomUUID()}-${safeBase.endsWith(".pdf") ? safeBase : `${safeBase}.pdf`}`;
  const input = Buffer.from(await file.arrayBuffer());

  const fileUrl = await saveUploadBuffer({
    kind: "documents",
    filename,
    buffer: input,
    contentType: "application/pdf",
  });

  return {
    fileUrl,
    fileName: file.name,
  };
}

export async function saveGalleryImage(file: File): Promise<string> {
  if (!ALLOWED_GALLERY_TYPES.has(file.type)) {
    throw new Error("Yalnızca JPEG, PNG veya WEBP yüklenebilir.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Dosya boyutu 8 MB'den büyük olamaz.");
  }

  const filename = `${randomUUID()}.jpg`;
  const input = Buffer.from(await file.arrayBuffer());

  const output = await sharp(input)
    .rotate()
    .resize(GALLERY_CARD_WIDTH, GALLERY_CARD_HEIGHT, {
      fit: "cover",
      position: "attention",
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  return saveUploadBuffer({
    kind: "gallery",
    filename,
    buffer: output,
    contentType: "image/jpeg",
  });
}
