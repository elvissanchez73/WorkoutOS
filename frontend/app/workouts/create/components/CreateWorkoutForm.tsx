"use client"
import SubmitNewWorkout from "./SubmitNewWorkout";
import { useRouter } from "next/navigation";

const CreateWorkoutForm = () => {
const router = useRouter();
const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const reps = Number(formData.get("reps") as string);
    
    const weight_lbs = Number(formData.get("weight_lbs") as string);
        const response = await fetch("http://127.0.0.1:8000/workouts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            name,
            reps,
            weight_lbs,
        }),

        });

        
        if (!response.ok) {
            console.error("Failed to create workout");
            return ;
        }
       
        router.push("/workouts");
        router.refresh();
        }

        return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" className="bg-white border border-gray-300 rounded px-3 py-2 text-black ${className}"  required />
      <label htmlFor="reps">Reps:</label>
      <input type="number" id="reps" name="reps" className="bg-white border border-gray-300 rounded px-3 py-2 text-black ${className}" required />
      <label htmlFor="weight_lbs">Weight (lbs):</label>
      <input type="number" id="weight_lbs" name="weight_lbs" className="bg-white border border-gray-300 rounded px-3 py-2 text-black ${className}" required />
      <SubmitNewWorkout />
    </form>
  );

  };

  


export default CreateWorkoutForm;