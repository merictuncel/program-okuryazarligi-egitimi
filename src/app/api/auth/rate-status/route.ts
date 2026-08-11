import { NextResponse } from "next/server";
import { getRateLimitStatus } from "@/lib/rate-limit";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email().max(200),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }

  const status = getRateLimitStatus(`login:${parsed.data.email}`, 8, 15 * 60 * 1000);

  return NextResponse.json({
    ok: status.ok,
    retryAfterSec: status.retryAfterSec ?? null,
  });
}
