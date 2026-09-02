import Link from "next/link";
import RoutineList from "./components/RoutineList";
import { getApiUrl } from "@/lib/api";

type Routine = {
  id: number;
  name: string;
};

async function getRoutines(): Promise<Routine[]> {
  const response = await fetch(await getApiUrl("/routines"), {
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
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">Training Structure</span>
        <h1 className="page-title">Routines</h1>
        <p className="page-copy">
          Group your exercises into focused training days so every session has a plan.
        </p>
        <div className="action-row" style={{ marginTop: "24px" }}>
          <Link className="btn btn-primary" href="/routines/create">
            Create Routine
          </Link>
        </div>
      </section>

      <section className="page-stack">
        <div className="section-header">
          <h2 className="section-title">Saved routines</h2>
          <p className="status-text">{routines.length} active</p>
        </div>
        <RoutineList routines={routines} />
      </section>
    </main>
  );
}