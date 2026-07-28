from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Workout
import os
from pydantic import BaseModel
from workout_database import (
    add_exercise_to_routine,
    get_all_workouts,
    get_all_routines,
    get_info_workout,
    get_routine_exercises,
    insert_workout,
    create_routine,
    remove_exercise_from_routine,
    remove_routine,
    remove_workout,
    update_reps,
    update_weight,
    calculate_1rep_max,
)


class RoutineCreate(BaseModel):
    name: str


class RoutineResponse(BaseModel):
    id: int
    name: str


class WorkoutResponse(BaseModel):
    id: int
    name: str
    reps: int
    weight_lbs: int


class MessageResponse(BaseModel):
    message: str


class OneRepMaxResponse(BaseModel):
    estimated_1rm: float


class WorkoutCreate(BaseModel):
    name: str
    reps: int
    weight_lbs: int


class WorkoutUpdateReps(BaseModel):
    new_reps: int


class WorkoutUpdateWeight(BaseModel):
    new_weight: int


app = FastAPI(title="Workout Tracker API", version="1.0.0")

# Allow origins from environment (comma-separated) so deployed frontend can be added
_origins_env = os.getenv("ALLOWED_ORIGINS")
if _origins_env:
    origins = [o.strip() for o in _origins_env.split(",") if o.strip()]
else:
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Welcome to the Workout Tracker API!"}


@app.post("/workouts", response_model=MessageResponse)
def add_workout(workout: WorkoutCreate):
    success = insert_workout(workout)
    if success:
        return {
            "message": f"Exercise {workout.name} added with {workout.reps} reps and {workout.weight_lbs} lbs."
        }
    else:
        raise HTTPException(
            status_code=409, detail="Exercise already exists or failed to add exercise."
        )


@app.get("/workouts/{name}/1rm", response_model=OneRepMaxResponse)
def calculate_workout_1rm(name: str):
    exercise = get_info_workout(name)
    if exercise:
        success = calculate_1rep_max(name)
        if success is not None:
            one_rm = success
            return {"estimated_1rm": one_rm}
    else:
        raise HTTPException(status_code=404, detail="Exercise not found.")


@app.get("/workouts", response_model=list[WorkoutResponse])
def list_workouts():
    return get_all_workouts()


@app.get("/workouts/{name}", response_model=WorkoutResponse)
def get_workout(name: str):
    exercise = get_info_workout(name)

    if exercise:
        return exercise

    raise HTTPException(status_code=404, detail="Exercise not found.")


@app.delete("/workouts/{name}", response_model=MessageResponse)
def delete_workout(name: str):
    success = remove_workout(name)
    if success:
        return {"message": "Exercise deleted."}
    else:
        raise HTTPException(status_code=404, detail="Exercise not found.")


@app.put("/workouts/{name}/reps", response_model=MessageResponse)
def update_workout_reps(name: str, update: WorkoutUpdateReps):
    success = update_reps(name, update.new_reps)
    if success:
        return {"message": f"Reps updated to {update.new_reps}."}
    else:
        raise HTTPException(status_code=404, detail="Failed to update reps.")


@app.put("/workouts/{name}/weight", response_model=MessageResponse)
def update_workout_weight(name: str, update: WorkoutUpdateWeight):
    success = update_weight(name, update.new_weight)
    if success:
        return {"message": f"Weight updated to {update.new_weight} lbs."}
    else:
        raise HTTPException(status_code=404, detail="Failed to update weight.")


@app.post("/routines", response_model=MessageResponse)
def add_routine(routine: RoutineCreate):
    success = create_routine(routine.name)
    if success:
        return {"message": f"Routine {routine.name} created."}

    raise HTTPException(status_code=409, detail="Routine already exists.")


@app.get("/routines", response_model=list[RoutineResponse])
def list_routines():
    return get_all_routines()


@app.delete("/routines/{routine_name}", response_model=MessageResponse)
def delete_routine(routine_name: str):
    success = remove_routine(routine_name)
    if success:
        return {"message": f"Routine {routine_name} deleted."}

    raise HTTPException(status_code=404, detail="Routine not found.")


@app.post(
    "/routines/{routine_name}/exercises/{exercise_name}", response_model=MessageResponse
)
def add_workout_to_routine(routine_name: str, exercise_name: str):
    success = add_exercise_to_routine(routine_name, exercise_name)
    if success:
        return {"message": f"Exercise {exercise_name} added to {routine_name}."}

    raise HTTPException(
        status_code=404,
        detail="Routine or exercise not found, or exercise already exists in routine.",
    )


@app.get("/routines/{routine_name}/exercises", response_model=list[WorkoutResponse])
def list_routine_exercises(routine_name: str):
    exercises = get_routine_exercises(routine_name)
    if exercises is not None:
        return exercises

    raise HTTPException(status_code=404, detail="Routine not found.")


@app.delete(
    "/routines/{routine_name}/exercises/{exercise_name}", response_model=MessageResponse
)
def delete_workout_from_routine(routine_name: str, exercise_name: str):
    success = remove_exercise_from_routine(routine_name, exercise_name)
    if success:
        return {"message": f"Exercise {exercise_name} removed from {routine_name}."}

    raise HTTPException(
        status_code=404, detail="Routine or exercise relationship not found."
    )
