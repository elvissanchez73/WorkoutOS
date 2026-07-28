import CreateWorkoutButton from "./components/CreateWorkoutButton";
import WorkoutList from "./components/WorkoutList";

type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
};

async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch("http://127.0.0.1:8000/workouts", {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <main>
      <h1>Workouts</h1>
      <CreateWorkoutButton />
      <WorkoutList workouts={workouts} />
    </main>
  );
}

