import { deleteUpload } from "@/lib/storage";

/** Geriye uyumlu alias */
export async function deleteLocalUpload(fileUrl?: string | null) {
  await deleteUpload(fileUrl);
}
