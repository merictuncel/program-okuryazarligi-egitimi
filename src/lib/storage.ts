import { put, del } from "@vercel/blob";

export type UploadKind = "instructors" | "documents" | "gallery";

const ALLOWED_KINDS = new Set<UploadKind>([
  "instructors",
  "documents",
  "gallery",
]);

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Dosyayı Vercel Blob (üretim) veya yerel diske (yalnızca lokal) yazar */
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

  const local = await import(
    /* webpackIgnore: true */ /* turbopackIgnore: true */ "./storage-local"
  );
  return local.saveUploadBufferLocal(options);
}

/** Blob veya yerel dosyayı siler */
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

  const local = await import(
    /* webpackIgnore: true */ /* turbopackIgnore: true */ "./storage-local"
  );
  await local.deleteUploadLocal(fileUrl);
}

/** Yerel dosya yolu — Vercel/Blob'ta kullanılmaz */
export function resolveLocalUploadPath(_fileUrl: string): string | null {
  return null;
}

/** Yerel dosya okuma — yalnızca lokal development API route için */
export async function readLocalUpload(
  fileUrl: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (useBlobStorage() || process.env.VERCEL) return null;

  const local = await import(
    /* webpackIgnore: true */ /* turbopackIgnore: true */ "./storage-local"
  );
  return local.readUploadLocal(fileUrl);
}
