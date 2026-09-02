import { NextResponse } from "next/server";
import { createRoutine, listRoutines } from "@/lib/database";

export async function GET() {
  const routines = await listRoutines();
  return NextResponse.json(routines);
}

export async function POST(request: Request) {
  const body: { name?: unknown } = await request.json();
  const name = typeof body.name === "string" ? body.name : "";

  if (!name) {
    return NextResponse.json({ detail: "Invalid routine payload." }, { status: 400 });
  }

  try {
    await createRoutine(name);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error.";
    return NextResponse.json({ detail: `Failed to create routine: ${message}` }, { status: 500 });
  }

  return NextResponse.json({ message: `Routine ${name} created.` });
}