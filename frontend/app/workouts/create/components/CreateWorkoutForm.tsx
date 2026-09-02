"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SubmitNewWorkout from "./SubmitNewWorkout";

export default function CreateWorkoutForm() {
    const router = useRouter();
    const API_BASE = "/api";
    const [error, setError] = useState("");

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const reps = Number(formData.get("reps") as string);
        const weight_lbs = Number(formData.get("weight_lbs") as string);

        const response = await fetch(`${API_BASE}/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, reps, weight_lbs }),
        });

        if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
            setError(payload?.detail ?? "Failed to create workout.");
            return;
        }

        router.push("/workouts");
        router.refresh();
    }

    return (
        <form className="form-panel" onSubmit={handleFormSubmit}>
            <div className="field-group">
                <label className="field-label" htmlFor="name">
                    Exercise name
                </label>
                <input className="input-field" type="text" id="name" name="name" required />
            </div>

            <div className="field-group">
                <label className="field-label" htmlFor="reps">
                    Reps
                </label>
                <input className="input-field" type="number" id="reps" name="reps" required />
            </div>

            <div className="field-group">
                <label className="field-label" htmlFor="weight_lbs">
                    Weight in pounds
                </label>
                <input className="input-field" type="number" id="weight_lbs" name="weight_lbs" required />
            </div>

            <SubmitNewWorkout />

            {error && <p className="error-text">{error}</p>}
        </form>
    );
}