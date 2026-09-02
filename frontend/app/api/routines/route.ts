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

  const created = await createRoutine(name);

  if (!created) {
    return NextResponse.json({ detail: "Routine already exists." }, { status: 409 });
  }

  return NextResponse.json({ message: `Routine ${name} created.` });
}