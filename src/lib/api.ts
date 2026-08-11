import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export function zodErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      error: "Doğrulama hatası",
      details: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { response: NextResponse }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      response: NextResponse.json(
        { error: "Geçersiz JSON gövdesi" },
        { status: 400 },
      ),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { response: zodErrorResponse(parsed.error) };
  }

  return { data: parsed.data };
}
