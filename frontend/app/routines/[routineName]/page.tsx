"use client";

import AddExerciseToRoutineForm from "./components/AddExerciseToRoutineForm";
import RoutineExerciseList from "./components/RoutineExerciseList";
import { getRoutineExercises, type Workout } from "@/lib/localStore";
import { useEffect, useState } from "react";

export default function RoutinePage({
  params,
  searchParams,
}: {
  params: { routineName: string };
  searchParams: { addExercises?: string };
}) {
  const { routineName } = params;
  const { addExercises } = searchParams;
  const routineDecoded = decodeURIComponent(routineName);
  const [workoutData, setWorkoutData] = useState<Workout[]>([]);

  useEffect(() => {
    const items = getRoutineExercises(routineDecoded) ?? [];
    setWorkoutData(items);
  }, [routineDecoded]);

  return (
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">Routine</span>
        <h1 className="page-title">{routineDecoded}</h1>
        <p className="page-copy">
          Review the exercises in this plan and adjust the session before training.
        </p>
      </section>

      <AddExerciseToRoutineForm
        routineName={routineDecoded}
        initiallyOpen={addExercises === "true"}
      />
      <RoutineExerciseList routineName={routineDecoded} exercises={workoutData} />
    </main>
  );
}