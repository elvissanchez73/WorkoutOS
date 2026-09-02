import { NextResponse } from "next/server";
import {
  deleteWorkout,
  getWorkout,
  updateWorkoutReps,
  updateWorkoutWeight,
} from "@/lib/database";

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { name } = await params;
  const workout = await getWorkout(name);

  if (!workout) {
    return NextResponse.json({ detail: "Exercise not found." }, { status: 404 });
  }

  return NextResponse.json(workout);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { name } = await params;
  const deleted = await deleteWorkout(name);

  if (!deleted) {
    return NextResponse.json({ detail: "Exercise not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Exercise deleted." });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { name } = await params;
  const body: { new_reps?: unknown; new_weight?: unknown } = await request.json();

  if (typeof body.new_reps === "number") {
    const updated = await updateWorkoutReps(name, body.new_reps);

    if (!updated) {
      return NextResponse.json({ detail: "Failed to update reps." }, { status: 404 });
    }

    return NextResponse.json({ message: `Reps updated to ${body.new_reps}.` });
  }

  if (typeof body.new_weight === "number") {
    const updated = await updateWorkoutWeight(name, body.new_weight);

    if (!updated) {
      return NextResponse.json({ detail: "Failed to update weight." }, { status: 404 });
    }

    return NextResponse.json({ message: `Weight updated to ${body.new_weight} lbs.` });
  }

  return NextResponse.json({ detail: "Invalid workout update payload." }, { status: 400 });
}