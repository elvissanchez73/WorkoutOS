import Link from "next/link";
import RoutineList from "./components/RoutineList";
type Routine = {
  id: number;
  name: string;
};

async function getRoutines(): Promise<Routine[]> {
  const response = await fetch("http://127.0.0.1:8000/routines", {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function RoutinesPage() {
  
  const routines = await getRoutines();

  return (
    <main>
      <h1>Routines</h1>
      <p>Welcome to the Routines page!</p>
      <Link href="/routines/create">Create Routine</Link>
      <RoutineList routines={routines} />
    </main>
  );
}