'use client'; // This establishes the client boundary

export default function CreateWorkoutButton({  }: {  }) {
  const handleClick = () => {
    //Link to page to create a new workout
    window.location.href = "/workouts/create";
  };

  return (
    <button 
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Create Workout
    </button>
  );
}