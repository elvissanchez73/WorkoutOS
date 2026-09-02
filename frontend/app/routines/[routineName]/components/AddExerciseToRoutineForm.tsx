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
  const API_BASE = "/api";
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

    const response = await fetch(`${API_BASE}/workouts`);

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
          `${API_BASE}/routines/${encodeURIComponent(routineName)}/exercises/${encodeURIComponent(
            exerciseName
          )}`,
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
    <section className="fitness-card">
      {!isOpen ? (
        <button type="button" onClick={loadWorkouts} disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Loading exercises..." : "Add Existing Exercises"}
        </button>
      ) : (
        <form className="page-stack" onSubmit={handleSubmit}>
          <h2 className="section-title">Add exercises to {routineName}</h2>

          {workouts.length === 0 ? (
            <p className="status-text">No exercises available.</p>
          ) : (
            <ul className="card-grid">
              {workouts.map((workout) => (
                <li
                  className={`fitness-card ${
                    selectedExercises.includes(workout.name) ? "is-selected" : ""
                  }`}
                  key={workout.id}
                >
                  <label className="item-row">
                    <input
                      className="item-check"
                      type="checkbox"
                      checked={selectedExercises.includes(workout.name)}
                      onChange={() => handleExerciseToggle(workout.name)}
                    />
                    <span className="item-main">
                      <span className="item-name">{workout.name}</span>
                      <span className="item-meta">
                        <span className="metric">
                          <strong>{workout.weight_lbs}</strong> lb
                        </span>
                        <span className="metric">
                          <strong>{workout.reps}</strong> reps
                        </span>
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className="action-row">
            <button type="submit" className="btn btn-primary">
              Add Selected Exercises
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}