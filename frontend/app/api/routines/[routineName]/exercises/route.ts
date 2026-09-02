import { NextResponse } from "next/server";
import { listRoutineExercises } from "@/lib/database";

type RouteParams = {
  params: Promise<{ routineName: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { routineName } = await params;
  const exercises = await listRoutineExercises(routineName);

  if (exercises === null) {
    return NextResponse.json({ detail: "Routine not found." }, { status: 404 });
  }

  return NextResponse.json(exercises);
}