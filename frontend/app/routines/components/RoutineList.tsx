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
        fetch(`http://127.0.0.1:8000/routines/${encodeURIComponent(routineName)}`, {
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
    <form onSubmit={handleSubmit}>
      {routines.length === 0 ? (
        <p>No routines found.</p>
      ) : (
        <ul>
          {routines.map((routine) => (
            <li key={routine.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedRoutines.includes(routine.name)}
                  onChange={() => handleRoutineToggle(routine.name)}
                />
                <Link href={`/routines/${encodeURIComponent(routine.name)}`}>
                  {routine.name}
                </Link>
              </label>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
        Delete Selected Routines
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}