import { NextResponse } from "next/server";
import { createWorkout, listWorkouts } from "@/lib/database";

export async function GET() {
  const workouts = await listWorkouts();
  return NextResponse.json(workouts);
}

export async function POST(request: Request) {
  const body: { name?: unknown; reps?: unknown; weight_lbs?: unknown } = await request.json();
  const name = typeof body.name === "string" ? body.name : "";
  const reps = Number(body.reps);
  const weightLbs = Number(body.weight_lbs);

  if (!name || Number.isNaN(reps) || Number.isNaN(weightLbs)) {
    return NextResponse.json({ detail: "Invalid workout payload." }, { status: 400 });
  }

  try {
    await createWorkout(name, reps, weightLbs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error.";
    return NextResponse.json(
      { detail: `Failed to create workout: ${message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `Exercise ${name} added with ${reps} reps and ${weightLbs} lbs.`,
  });
}