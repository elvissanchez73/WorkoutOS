import Link from "next/link";

export default function Home() {
  return (
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">WorkoutOS</span>
        <h1 className="page-title">Train with structure. Track with intent.</h1>
        <p className="page-copy">
          Build routines, manage exercises, and keep every lift organized before
          the next session starts.
        </p>
        <div className="action-row" style={{ marginTop: "24px" }}>
          <Link className="btn btn-primary" href="/workouts">
            View Workouts
          </Link>
          <Link className="btn btn-secondary" href="/routines">
            Manage Routines
          </Link>
        </div>
      </section>

      <section className="card-grid">
        <article className="fitness-card">
          <span className="eyebrow">Today</span>
          <h2 className="section-title">Ready for your next lift</h2>
          <p className="page-copy">
            Open a routine and know exactly which exercises are waiting.
          </p>
        </article>
        <article className="fitness-card">
          <span className="eyebrow">Progress</span>
          <h2 className="section-title">Every number matters</h2>
          <p className="page-copy">
            Reps, weight, and estimated one-rep maxes stay easy to scan.
          </p>
        </article>
      </section>
    </main>
  );
}
