import { NextResponse } from "next/server";
import { updateWorkoutReps } from "@/lib/database";

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  const { name } = await params;
  const body: { new_reps?: unknown } = await request.json();
  const reps = Number(body.new_reps);

  if (Number.isNaN(reps)) {
    return NextResponse.json({ detail: "Invalid reps payload." }, { status: 400 });
  }

  const updated = await updateWorkoutReps(name, reps);

  if (!updated) {
    return NextResponse.json({ detail: "Failed to update reps." }, { status: 404 });
  }

  return NextResponse.json({ message: `Reps updated to ${reps}.` });
}