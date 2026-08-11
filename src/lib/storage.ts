import { put, del } from "@vercel/blob";
import type { UploadKind } from "@/lib/storage-types";

export type { UploadKind };

const ALLOWED_KINDS = new Set<UploadKind>([
  "instructors",
  "documents",
  "gallery",
]);

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function saveLocal(options: {
  kind: UploadKind;
  filename: string;
  buffer: Buffer;
  contentType: string;
}): Promise<string> {
  const mod = "storage-local";
  const local = await import(`@/lib/${mod}`);
  return local.saveUploadBufferLocal(options);
}

async function deleteLocal(fileUrl: string) {
  const mod = "storage-local";
  const local = await import(`@/lib/${mod}`);
  await local.deleteUploadLocal(fileUrl);
}

/** Dosyayı Vercel Blob veya (yalnızca lokal) diske yazar */
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

  if (useBlobStorage()) {
    const blob = await put(`uploads/${kind}/${filename}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Vercel'de BLOB_READ_WRITE_TOKEN tanımlı olmalıdır (Storage → Blob).",
    );
  }

  return saveLocal(options);
}

export async function deleteUpload(fileUrl?: string | null) {
  if (!fileUrl) return;

  if (/^https?:\/\//i.test(fileUrl) && fileUrl.includes("blob.vercel-storage.com")) {
    try {
      await del(fileUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch {
      // ignore
    }
    return;
  }

  if (useBlobStorage() || process.env.VERCEL) return;

  await deleteLocal(fileUrl);
}

export function resolveLocalUploadPath(_fileUrl: string): string | null {
  return null;
}

export async function readLocalUpload(
  _fileUrl: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  return null;
}
