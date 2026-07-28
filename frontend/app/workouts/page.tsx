import CreateWorkoutButton from "./components/CreateWorkoutButton";
import WorkoutList from "./components/WorkoutList";

type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
  estimated_1rm: number | null;
};

type ApiWorkout = Omit<Workout, "estimated_1rm">;

async function getWorkouts(): Promise<Workout[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const response = await fetch(`${API_BASE}/workouts`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const workouts: ApiWorkout[] = await response.json();

  return Promise.all(
    workouts.map(async (workout) => {
      const oneRepMaxResponse = await fetch(
        `${API_BASE}/workouts/${encodeURIComponent(workout.name)}/1rm`,
        { cache: "no-store" }
      );

      if (!oneRepMaxResponse.ok) {
        return { ...workout, estimated_1rm: null };
      }

      const data: { estimated_1rm: number } = await oneRepMaxResponse.json();
      return { ...workout, estimated_1rm: data.estimated_1rm };
    })
  );
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">Exercise Library</span>
        <h1 className="page-title">Workouts</h1>
        <p className="page-copy">
          Keep your lifts organized with the weight and reps that matter most.
        </p>
        <div className="action-row" style={{ marginTop: "24px" }}>
          <CreateWorkoutButton />
        </div>
      </section>

      <section className="page-stack">
        <div className="section-header">
          <h2 className="section-title">Exercise inventory</h2>
          <p className="status-text">{workouts.length} saved</p>
        </div>
        <WorkoutList workouts={workouts} />
      </section>
    </main>
  );
}

