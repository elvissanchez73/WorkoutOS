"use client";

import CreateWorkoutButton from "./components/CreateWorkoutButton";
import WorkoutList from "./components/WorkoutList";
import { getWorkouts, type Workout } from "@/lib/localStore";
import { useEffect, useState } from "react";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<(Workout & { estimated_1rm: number | null })[]>([]);

  useEffect(() => {
    const items = getWorkouts().map((workout) => ({
      ...workout,
      estimated_1rm: workout.weight_lbs * (1 + workout.reps / 30),
    }));
    setWorkouts(items);
  }, []);

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

