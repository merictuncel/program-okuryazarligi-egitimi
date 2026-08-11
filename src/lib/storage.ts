import { put } from "@vercel/blob";
import type { UploadKind } from "@/lib/storage-types";

export type { UploadKind };

const ALLOWED_KINDS = new Set<UploadKind>([
  "instructors",
  "documents",
  "gallery",
]);

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

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (token) {
    const blob = await put(`uploads/${kind}/${filename}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      token,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Vercel'de BLOB_READ_WRITE_TOKEN tanımlı olmalıdır (Storage → Blob).",
    );
  }

  const mod = "storage-local";
  const local = await import(`@/lib/${mod}`);
  return local.saveUploadBufferLocal(options);
}

export async function deleteUpload(fileUrl?: string | null) {
  const { deleteLocalUpload } = await import("@/lib/files");
  await deleteLocalUpload(fileUrl);
}

export function resolveLocalUploadPath(_fileUrl: string): string | null {
  return null;
}

export async function readLocalUpload(
  _fileUrl: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  return null;
}
