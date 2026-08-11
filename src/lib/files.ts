import { del } from "@vercel/blob";

/** Blob veya (yalnızca lokal) dosyayı siler — fs/cwd import etmez */
export async function deleteLocalUpload(fileUrl?: string | null) {
  if (!fileUrl) return;

  if (/^https?:\/\//i.test(fileUrl) && fileUrl.includes("blob.vercel-storage.com")) {
    try {
      await del(fileUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch {
      // ignore
    }
    return;
  }

  // Vercel'de yerel disk yok
  if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return;
  }

  const mod = "storage-local";
  const local = await import(`@/lib/${mod}`);
  await local.deleteUploadLocal(fileUrl);
}
