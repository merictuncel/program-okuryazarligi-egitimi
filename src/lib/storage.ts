import { put, del } from "@vercel/blob";
import type { UploadKind } from "@/lib/storage-types";

export type { UploadKind };

const ALLOWED_KINDS = new Set<UploadKind>([
  "instructors",
  "documents",
  "gallery",
]);

/**
 * Üretim: yalnızca Vercel Blob.
 * Yerel disk kodu bu modülde yok (Turbopack/Vercel fs izlemesi olmasın).
 */
export async function saveUploadBuffer(options: {
  kind: UploadKind;
  filename: string;
  buffer: Buffer;
  contentType: string;
}): Promise<string> {
  const { kind, filename, buffer, contentType } = options;
  if (!ALLOWED_KINDS.has(kind)) {
    throw new Error("Geçersiz yükleme klasörü.");
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN gerekli. Vercel Storage → Blob token ekleyin. Yerelde .env'e yazın.",
    );
  }

  const blob = await put(`uploads/${kind}/${filename}`, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    token,
  });
  return blob.url;
}

export async function deleteUpload(fileUrl?: string | null) {
  if (!fileUrl) return;
  if (!/^https?:\/\//i.test(fileUrl)) return;
  if (!fileUrl.includes("blob.vercel-storage.com")) return;
  try {
    await del(fileUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch {
    // ignore
  }
}

export function resolveLocalUploadPath(_fileUrl: string): string | null {
  return null;
}

export async function readLocalUpload(
  _fileUrl: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  return null;
}
