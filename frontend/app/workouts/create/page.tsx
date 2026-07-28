//three input fields for name, reps, and weight in lbs, and a submit button that sends a post request to the backend to create a new workout
import CreateWorkoutForm from "./components/CreateWorkoutForm";

export default function CreateWorkoutPage() {
  return (
    <main>
      <h1>Create Workout</h1>
      <p>Welcome to the Create Workout page!</p>
        <CreateWorkoutForm />
      
    </main>
  );
}