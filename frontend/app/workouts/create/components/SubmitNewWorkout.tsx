//button that links to the create workout query

'use client'; // This establishes the client boundary

export default function SubmitNewWorkout({  }: {  }) {
  

  return (
    <button type="submit"
    
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Submit Workout
    </button>
  );
}