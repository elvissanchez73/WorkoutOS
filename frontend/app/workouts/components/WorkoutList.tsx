"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
};

type WorkoutListProps = {
  workouts: Workout[];
};

export default function WorkoutList({ workouts }: WorkoutListProps) {
  const router = useRouter();
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleWorkoutToggle(workoutName: string) {
    setSelectedWorkouts((currentWorkouts) => {
      if (currentWorkouts.includes(workoutName)) {
        return currentWorkouts.filter((name) => name !== workoutName);
      }

      return [...currentWorkouts, workoutName];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (selectedWorkouts.length === 0) {
      setError("Select at least one workout to delete.");
      return;
    }

    const responses = await Promise.all(
      selectedWorkouts.map((workoutName) =>
        fetch(`http://127.0.0.1:8000/workouts/${encodeURIComponent(workoutName)}`, {
          method: "DELETE",
        })
      )
    );

    const failedResponse = responses.find((response) => !response.ok);

    if (failedResponse) {
      setError("One or more workouts could not be deleted.");
      return;
    }

    setSelectedWorkouts([]);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      {workouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedWorkouts.includes(workout.name)}
                  onChange={() => handleWorkoutToggle(workout.name)}
                />
                {workout.name} - {workout.reps} reps - {workout.weight_lbs} lbs
              </label>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
        Delete Selected Workouts
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}