"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Routine = {
  id: number;
  name: string;
};

type RoutineListProps = {
  routines: Routine[];
};

export default function RoutineList({ routines }: RoutineListProps) {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleRoutineToggle(routineName: string) {
    setSelectedRoutines((currentRoutines) => {
      if (currentRoutines.includes(routineName)) {
        return currentRoutines.filter((name) => name !== routineName);
      }

      return [...currentRoutines, routineName];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (selectedRoutines.length === 0) {
      setError("Select at least one routine to delete.");
      return;
    }

    const responses = await Promise.all(
      selectedRoutines.map((routineName) =>
        fetch(`${API_BASE}/routines/${encodeURIComponent(routineName)}`, {
          method: "DELETE",
        })
      )
    );

    const failedResponse = responses.find((response) => !response.ok);

    if (failedResponse) {
      setError("One or more routines could not be deleted.");
      return;
    }

    setSelectedRoutines([]);
    router.refresh();
  }

  return (
    <form className="page-stack" onSubmit={handleSubmit}>
      {routines.length === 0 ? (
        <div className="empty-state">
          <p>No routines yet. Create your first training day and add exercises.</p>
        </div>
      ) : (
        <ul className="card-grid">
          {routines.map((routine) => (
            <li
              className={`fitness-card ${
                selectedRoutines.includes(routine.name) ? "is-selected" : ""
              }`}
              key={routine.id}
            >
              <label className="item-row">
                <input
                  className="item-check"
                  type="checkbox"
                  checked={selectedRoutines.includes(routine.name)}
                  onChange={() => handleRoutineToggle(routine.name)}
                />
                <span className="item-main">
                  <Link
                    className="card-link"
                    href={`/routines/${encodeURIComponent(routine.name)}`}
                  >
                    <span className="item-name">{routine.name}</span>
                    <span className="item-meta">
                      <span className="metric">
                        <strong>Open</strong> plan
                      </span>
                    </span>
                  </Link>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="btn btn-danger">
        Delete Selected Routines
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}