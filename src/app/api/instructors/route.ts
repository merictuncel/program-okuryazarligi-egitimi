import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/api";
import { requireAdminSession } from "@/lib/session";
import { instructorSchema } from "@/lib/validations";

export async function GET() {
  const instructors = await prisma.instructor.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(instructors);
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const parsed = await parseJsonBody(request, instructorSchema);
  if ("response" in parsed) return parsed.response;

  const instructor = await prisma.instructor.create({
    data: parsed.data,
  });

  return NextResponse.json(instructor, { status: 201 });
}
