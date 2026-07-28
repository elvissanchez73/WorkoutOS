"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Workout = {
	id: number;
	name: string;
	reps: number;
	weight_lbs: number;
};

type RoutineExerciseListProps = {
	routineName: string;
	exercises: Workout[];
};

export default function RoutineExerciseList({
	routineName,
	exercises,
}: RoutineExerciseListProps) {
	const router = useRouter();
	const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
	const [error, setError] = useState("");

	function handleExerciseToggle(exerciseName: string) {
		setSelectedExercises((currentExercises) => {
			if (currentExercises.includes(exerciseName)) {
				return currentExercises.filter((name) => name !== exerciseName);
			}

			return [...currentExercises, exerciseName];
		});
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");

		if (selectedExercises.length === 0) {
			setError("Select at least one exercise to remove.");
			return;
		}

		const responses = await Promise.all(
			selectedExercises.map((exerciseName) =>
				fetch(
					`http://127.0.0.1:8000/routines/${encodeURIComponent(
						routineName
					)}/exercises/${encodeURIComponent(exerciseName)}`,
					{
						method: "DELETE",
					}
				)
			)
		);

		const failedResponse = responses.find((response) => !response.ok);

		if (failedResponse) {
			setError("One or more exercises could not be removed.");
			return;
		}

		setSelectedExercises([]);
		router.refresh();
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Exercises in this routine</h2>

			{exercises.length === 0 ? (
				<p>No exercises in this routine yet.</p>
			) : (
				<ul className="flex flex-col gap-2 list-disc pl-5">
					{exercises.map((exercise) => (
						<li key={exercise.id}>
							<label>
								<input
									type="checkbox"
									checked={selectedExercises.includes(exercise.name)}
									onChange={() => handleExerciseToggle(exercise.name)}
								/>
								{exercise.name} - {exercise.reps} reps - {exercise.weight_lbs} lbs
							</label>
						</li>
					))}
				</ul>
			)}

			<button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
				Remove Selected Exercises
			</button>

			{error && <p>{error}</p>}
		</form>
	);
}
