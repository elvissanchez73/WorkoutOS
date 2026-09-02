"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { removeExercisesFromRoutine } from "@/lib/localStore";

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

		removeExercisesFromRoutine(routineName, selectedExercises);

		setSelectedExercises([]);
		router.refresh();
	}

	return (
		<form className="page-stack" onSubmit={handleSubmit}>
			<div className="section-header">
				<h2 className="section-title">Exercises in this routine</h2>
				<p className="status-text">{exercises.length} selected plan items</p>
			</div>

			{exercises.length === 0 ? (
				<div className="empty-state">
					<p>No exercises in this routine yet. Add existing exercises to build the plan.</p>
				</div>
			) : (
				<ul className="card-grid">
					{exercises.map((exercise) => (
						<li
							className={`fitness-card ${
								selectedExercises.includes(exercise.name) ? "is-selected" : ""
							}`}
							key={exercise.id}
						>
							<label className="item-row">
								<input
									className="item-check"
									type="checkbox"
									checked={selectedExercises.includes(exercise.name)}
									onChange={() => handleExerciseToggle(exercise.name)}
								/>
								<span className="item-main">
									<span className="item-name">{exercise.name}</span>
									<span className="item-meta">
										<span className="metric">
											<strong>{exercise.weight_lbs}</strong> lb
										</span>
										<span className="metric">
											<strong>{exercise.reps}</strong> reps
										</span>
									</span>
								</span>
							</label>
						</li>
					))}
				</ul>
			)}

			<button type="submit" className="btn btn-danger">
				Remove Selected Exercises
			</button>

			{error && <p className="error-text">{error}</p>}
		</form>
	);
}
