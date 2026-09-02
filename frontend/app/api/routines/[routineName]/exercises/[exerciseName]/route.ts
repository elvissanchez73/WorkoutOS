import { NextResponse } from "next/server";
import { addExerciseToRoutine, removeExerciseFromRoutine } from "@/lib/database";

type RouteParams = {
  params: Promise<{ routineName: string; exerciseName: string }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
  const { routineName, exerciseName } = await params;
  const added = await addExerciseToRoutine(routineName, exerciseName);

  if (!added) {
    return NextResponse.json(
      {
        detail:
          "Routine or exercise not found, or exercise already exists in routine.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: `Exercise ${exerciseName} added to ${routineName}.`,
  });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { routineName, exerciseName } = await params;
  const removed = await removeExerciseFromRoutine(routineName, exerciseName);

  if (!removed) {
    return NextResponse.json(
      { detail: "Routine or exercise relationship not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: `Exercise ${exerciseName} removed from ${routineName}.`,
  });
}