"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createRoutine } from "@/lib/localStore";

export default function CreateRoutineForm() {
	const router = useRouter();
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name") as string;

		const result = createRoutine(name);

		if (!result.ok) {
			setError(result.message ?? "Failed to create routine.");
			return;
		}

		router.push(`/routines/${encodeURIComponent(name)}?addExercises=true`);
		router.refresh();
	}

	return (
		<form className="form-panel" onSubmit={handleSubmit}>
			<div className="field-group">
				<label className="field-label" htmlFor="name">
					Routine name
				</label>
				<input className="input-field" type="text" id="name" name="name" required />
			</div>

			<button type="submit" className="btn btn-primary">
				Create Routine
			</button>

			{error && <p className="error-text">{error}</p>}
		</form>
	);
}
