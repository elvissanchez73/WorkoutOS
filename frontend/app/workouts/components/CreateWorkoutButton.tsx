"use client";

export default function CreateWorkoutButton() {
  const handleClick = () => {
    //Link to page to create a new workout
    window.location.href = "/workouts/create";
  };

  return (
    <button onClick={handleClick} className="btn btn-primary">
      Create Workout
    </button>
  );
}