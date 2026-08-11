import path from "path";
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

function localUploadRoot() {
  const dataDir = process.env.DATA_DIR?.trim();
  if (dataDir) {
    return path.join(dataDir, "uploads");
  }
  return path.join(process.cwd(), "public", "uploads");
}

function localPublicUrl(kind: UploadKind, filename: string) {
  if (process.env.DATA_DIR?.trim()) {
    return `/api/uploads/${kind}/${filename}`;
  }
  return `/uploads/${kind}/${filename}`;
}

/** Dosyayı Vercel Blob veya yerel diske yazar; erişilebilir URL döner */
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

  const fs = await import("fs/promises");
  const dir = path.join(localUploadRoot(), kind);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return localPublicUrl(kind, filename);
}

/** Yerel /uploads/... , /api/uploads/... veya Vercel Blob URL siler */
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

  // Vercel Blob kullanılıyorsa yerel silme yok
  if (useBlobStorage()) return;

  const normalized = fileUrl
    .replace(/^\/api\/uploads\//, "/uploads/")
    .replace(/^\/uploads\//, "/uploads/");

  if (!normalized.startsWith("/uploads/")) return;

  const relative = normalized.slice("/uploads/".length);
  const parts = relative.split("/").filter(Boolean);
  if (parts.length !== 2) return;

  const [subdir, filename] = parts;
  if (!ALLOWED_KINDS.has(subdir as UploadKind)) return;
  if (!filename || filename.includes("..") || filename.includes("\\")) return;

  const fs = await import("fs/promises");
  const full = path.join(localUploadRoot(), subdir, filename);
  try {
    await fs.unlink(full);
  } catch {
    // ignore
  }
}

export function resolveLocalUploadPath(fileUrl: string): string | null {
  if (useBlobStorage()) return null;

  const normalized = fileUrl.replace(/^\/api\/uploads\//, "/uploads/");
  if (!normalized.startsWith("/uploads/")) return null;
  const relative = normalized.slice("/uploads/".length);
  const parts = relative.split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [subdir, filename] = parts;
  if (!ALLOWED_KINDS.has(subdir as UploadKind)) return null;
  if (!filename || filename.includes("..")) return null;
  return path.join(localUploadRoot(), subdir, filename);
}

export async function readLocalUpload(
  fileUrl: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const full = resolveLocalUploadPath(fileUrl);
  if (!full) return null;
  try {
    const fs = await import("fs/promises");
    const buffer = await fs.readFile(full);
    const ext = path.extname(full).toLowerCase();
    const mime: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".pdf": "application/pdf",
    };
    return { buffer, contentType: mime[ext] ?? "application/octet-stream" };
  } catch {
    return null;
  }
}
