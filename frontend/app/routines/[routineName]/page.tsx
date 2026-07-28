import AddExerciseToRoutineForm from "./components/AddExerciseToRoutineForm";
import RoutineExerciseList from "./components/RoutineExerciseList";

type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
};

export default async function RoutinePage({
  params,
  searchParams,
}: {
  params: Promise<{ routineName: string }>;
  searchParams: Promise<{ addExercises?: string }>;
}) {
  const { routineName } = await params;
  const { addExercises } = await searchParams;
  const routineDecoded = decodeURIComponent(routineName);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const workoutResponse = await fetch(`${API_BASE}/routines/${routineName}/exercises`, {
    cache: "no-store",
  });

  if (!workoutResponse.ok) {
    return <p>Failed to fetch routine details.</p>;
  }

  const workoutData: Workout[] = await workoutResponse.json();

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