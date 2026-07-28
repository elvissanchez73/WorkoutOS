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

  const workoutResponse = await fetch(
    `http://127.0.0.1:8000/routines/${routineName}/exercises`,
    {
      cache: "no-store",
    }
  );

  if (!workoutResponse.ok) {
    return <p>Failed to fetch routine details.</p>;
  }

  const workoutData: Workout[] = await workoutResponse.json();

  return (
    <div>
      <h1>Exercises in {routineDecoded}</h1>

      <AddExerciseToRoutineForm
        routineName={routineDecoded}
        initiallyOpen={addExercises === "true"}
      />
      <RoutineExerciseList routineName={routineDecoded} exercises={workoutData} />
    </div>
  );
}