import { NextResponse } from "next/server";
import { updateWorkoutWeight } from "@/lib/database";

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  const { name } = await params;
  const body: { new_weight?: unknown } = await request.json();
  const weight = Number(body.new_weight);

  if (Number.isNaN(weight)) {
    return NextResponse.json({ detail: "Invalid weight payload." }, { status: 400 });
  }

  const updated = await updateWorkoutWeight(name, weight);

  if (!updated) {
    return NextResponse.json({ detail: "Failed to update weight." }, { status: 404 });
  }

  return NextResponse.json({ message: `Weight updated to ${weight} lbs.` });
}