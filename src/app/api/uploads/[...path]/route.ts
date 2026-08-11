import { NextRequest, NextResponse } from "next/server";
import { readLocalUpload } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * DATA_DIR ile kalıcı disk kullanımında dosya sunumu.
 * Yerelde public/uploads statik servis edilir; bu route yedek/path uyumu içindir.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments || segments.length !== 2) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileUrl = `/uploads/${segments[0]}/${segments[1]}`;
  const file = await readLocalUpload(fileUrl);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
