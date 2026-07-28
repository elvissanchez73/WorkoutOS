"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
};

type AddExerciseToRoutineFormProps = {
  routineName: string;
  initiallyOpen?: boolean;
};

export default function AddExerciseToRoutineForm({
  routineName,
  initiallyOpen = false,
}: AddExerciseToRoutineFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initiallyOpen) {
      loadWorkouts();
    }
  }, [initiallyOpen]);

  async function loadWorkouts() {
    setError("");
    setIsLoading(true);

    const response = await fetch("http://127.0.0.1:8000/workouts");

    if (!response.ok) {
      setError("Failed to load exercises.");
      setIsLoading(false);
      return;
    }

    const data: Workout[] = await response.json();
    setWorkouts(data);
    setIsOpen(true);
    setIsLoading(false);
  }

  function handleExerciseToggle(exerciseName: string) {
    setSelectedExercises((currentExercises) => {
      if (currentExercises.includes(exerciseName)) {
        return currentExercises.filter((name) => name !== exerciseName);
      }

      return [...currentExercises, exerciseName];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (selectedExercises.length === 0) {
      setError("Select at least one exercise.");
      return;
    }

    const responses = await Promise.all(
      selectedExercises.map((exerciseName) =>
        fetch(
          `http://127.0.0.1:8000/routines/${encodeURIComponent(
            routineName
          )}/exercises/${encodeURIComponent(exerciseName)}`,
          {
            method: "POST",
          }
        )
      )
    );

    const failedResponse = responses.find((response) => !response.ok);

    if (failedResponse) {
      setError("One or more exercises could not be added.");
      return;
    }

    setSelectedExercises([]);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <section>
      {!isOpen ? (
        <button type="button" onClick={loadWorkouts} disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isLoading ? "Loading exercises..." : "Add Existing Exercises"}
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Add exercises to {routineName}</h2>

          {workouts.length === 0 ? (
            <p>No exercises available.</p>
          ) : (
           
                <ul className="flex flex-col gap-2 list-disc pl-5">
              {workouts.map((workout) => (
                <label key={workout.id}>
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(workout.name)}
                    onChange={() => handleExerciseToggle(workout.name)}
                  />
                  {workout.name} - {workout.reps} reps - {workout.weight_lbs} lbs
                </label>
               
              ))}
              </ul>
           
          )}

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Selected Exercises
          </button>
          <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
            Cancel
          </button>
        </form>
      )}

      {error && <p>{error}</p>}
    </section>
  );
}