import CreateWorkoutForm from "./components/CreateWorkoutForm";

export default function CreateWorkoutPage() {
  return (
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">New Exercise</span>
        <h1 className="page-title">Create Workout</h1>
        <p className="page-copy">
          Add a lift with the working weight and reps you want to track.
        </p>
      </section>
      <CreateWorkoutForm />
    </main>
  );
}