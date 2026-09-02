import { NextResponse } from "next/server";
import { deleteRoutine } from "@/lib/database";

type RouteParams = {
  params: Promise<{ routineName: string }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { routineName } = await params;
  const deleted = await deleteRoutine(routineName);

  if (!deleted) {
    return NextResponse.json({ detail: "Routine not found." }, { status: 404 });
  }

  return NextResponse.json({ message: `Routine ${routineName} deleted.` });
}