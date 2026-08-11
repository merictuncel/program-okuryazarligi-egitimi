/**
 * Yalnızca lokal / VPS (DATA_DIR) — Vercel üretim paketinde kullanılmaz.
 * storage.ts bunu dinamik import ile çağırır.
 */
import { mkdir, writeFile, unlink, readFile } from "node:fs/promises";
import path from "node:path";

export type UploadKind = "instructors" | "documents" | "gallery";

const ALLOWED_KINDS = new Set<UploadKind>([
  "instructors",
  "documents",
  "gallery",
]);

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

export async function saveUploadBufferLocal(options: {
  kind: UploadKind;
  filename: string;
  buffer: Buffer;
  contentType: string;
}): Promise<string> {
  const { kind, filename, buffer } = options;
  const dir = path.join(localUploadRoot(), kind);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return localPublicUrl(kind, filename);
}

export async function deleteUploadLocal(fileUrl: string) {
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

  try {
    await unlink(path.join(localUploadRoot(), subdir, filename));
  } catch {
    // ignore
  }
}

export async function readUploadLocal(
  fileUrl: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const normalized = fileUrl.replace(/^\/api\/uploads\//, "/uploads/");
  if (!normalized.startsWith("/uploads/")) return null;
  const relative = normalized.slice("/uploads/".length);
  const parts = relative.split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [subdir, filename] = parts;
  if (!ALLOWED_KINDS.has(subdir as UploadKind)) return null;
  if (!filename || filename.includes("..")) return null;

  try {
    const full = path.join(localUploadRoot(), subdir, filename);
    const buffer = await readFile(full);
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
