import CreateRoutineForm from "../components/CreateRoutineForm";

export default function CreateRoutinePage() {
  return (
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">New Plan</span>
        <h1 className="page-title">Create Routine</h1>
        <p className="page-copy">
          Name the training day first, then add existing exercises to build the plan.
        </p>
      </section>
      <CreateRoutineForm />
    </main>
  );
}