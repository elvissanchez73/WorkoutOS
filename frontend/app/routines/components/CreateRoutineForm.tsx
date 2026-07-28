"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateRoutineForm() {
	const router = useRouter();
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name") as string;

		const response = await fetch("http://127.0.0.1:8000/routines", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		});

		if (!response.ok) {
			setError("Failed to create routine.");
			return;
		}

		router.push(`/routines/${encodeURIComponent(name)}?addExercises=true`);
		router.refresh();
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="name">Routine name:</label>
			<input type="text" id="name" name="name" className="bg-white border border-gray-300 rounded px-3 py-2 text-black ${className}" required />

			<button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
				Create Routine
			</button>

			{error && <p>{error}</p>}
		</form>
	);
}
