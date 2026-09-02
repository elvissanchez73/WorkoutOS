import { NextResponse } from "next/server";
import { calculateOneRepMax, getWorkout } from "@/lib/database";

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { name } = await params;
  const workout = await getWorkout(name);

  if (!workout) {
    return NextResponse.json({ detail: "Exercise not found." }, { status: 404 });
  }

  const estimatedOneRm = await calculateOneRepMax(name);

  if (estimatedOneRm === null) {
    return NextResponse.json({ detail: "Exercise not found." }, { status: 404 });
  }

  return NextResponse.json({ estimated_1rm: estimatedOneRm });
}