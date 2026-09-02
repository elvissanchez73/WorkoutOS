"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
  estimated_1rm: number | null;
};

type WorkoutListProps = {
  workouts: Workout[];
};

export default function WorkoutList({ workouts }: WorkoutListProps) {
  const API_BASE = "/api";
  const router = useRouter();
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [draftValues, setDraftValues] = useState<Record<string, { reps: number; weight_lbs: number }>>({});

  function getDraftValue(workout: Workout) {
    return draftValues[workout.name] ?? {
      reps: workout.reps,
      weight_lbs: workout.weight_lbs,
    };
  }

  function handleWorkoutToggle(workoutName: string) {
    setSelectedWorkouts((currentWorkouts) => {
      if (currentWorkouts.includes(workoutName)) {
        return currentWorkouts.filter((name) => name !== workoutName);
      }

      return [...currentWorkouts, workoutName];
    });
  }

  async function handleDeleteSelected() {
    setError("");

    if (selectedWorkouts.length === 0) {
      setError("Select at least one workout to delete.");
      return;
    }

    const responses = await Promise.all(
      selectedWorkouts.map((workoutName) =>
        fetch(`${API_BASE}/workouts/${encodeURIComponent(workoutName)}`, {
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

  async function handleUpdateWorkout(workout: Workout) {
    setError("");
    const draft = getDraftValue(workout);

    const [repsResponse, weightResponse] = await Promise.all([
      fetch(`${API_BASE}/workouts/${encodeURIComponent(workout.name)}/reps`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_reps: draft.reps }),
      }),
      fetch(`${API_BASE}/workouts/${encodeURIComponent(workout.name)}/weight`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_weight: draft.weight_lbs }),
      }),
    ]);

    if (!repsResponse.ok || !weightResponse.ok) {
      setError("Workout could not be updated.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="page-stack">
      {workouts.length === 0 ? (
        <div className="empty-state">
          <p>No workouts yet. Create your first exercise and start building your library.</p>
        </div>
      ) : (
        <ul className="card-grid">
          {workouts.map((workout) => (
            <li
              className={`fitness-card ${
                selectedWorkouts.includes(workout.name) ? "is-selected" : ""
              }`}
              key={workout.id}
            >
              <label className="item-row">
                <input
                  className="item-check"
                  type="checkbox"
                  checked={selectedWorkouts.includes(workout.name)}
                  onChange={() => handleWorkoutToggle(workout.name)}
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
                    <span className="metric">
                      <strong>
                        {workout.estimated_1rm === null
                          ? "--"
                          : workout.estimated_1rm.toFixed(1)}
                      </strong>
                      1RM
                    </span>
                  </span>

                  <span className="action-row" style={{ marginTop: "14px" }}>
                    <span className="field-group" style={{ minWidth: "92px" }}>
                      <span className="field-label">Reps</span>
                      <input
                        className="input-field"
                        type="number"
                        value={getDraftValue(workout).reps}
                        onChange={(event) =>
                          setDraftValues((currentValues) => ({
                            ...currentValues,
                            [workout.name]: {
                              ...getDraftValue(workout),
                              reps: Number(event.target.value),
                            },
                          }))
                        }
                      />
                    </span>
                    <span className="field-group" style={{ minWidth: "110px" }}>
                      <span className="field-label">Weight</span>
                      <input
                        className="input-field"
                        type="number"
                        value={getDraftValue(workout).weight_lbs}
                        onChange={(event) =>
                          setDraftValues((currentValues) => ({
                            ...currentValues,
                            [workout.name]: {
                              ...getDraftValue(workout),
                              weight_lbs: Number(event.target.value),
                            },
                          }))
                        }
                      />
                    </span>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => handleUpdateWorkout(workout)}
                    >
                      Update
                    </button>
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="btn btn-danger" onClick={handleDeleteSelected}>
        Delete Selected Workouts
      </button>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}