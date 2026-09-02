export type Workout = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
};

export type Routine = {
  id: number;
  name: string;
  exerciseNames: string[];
};

const WORKOUTS_KEY = "gym_tracker_workouts";
const ROUTINES_KEY = "gym_tracker_routines";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getWorkouts() {
  return readJson<Workout[]>(WORKOUTS_KEY, []);
}

export function saveWorkouts(workouts: Workout[]) {
  writeJson(WORKOUTS_KEY, workouts);
}

export function getRoutines() {
  return readJson<Routine[]>(ROUTINES_KEY, []);
}

export function saveRoutines(routines: Routine[]) {
  writeJson(ROUTINES_KEY, routines);
}

export function createWorkout(input: { name: string; reps: number; weight_lbs: number }) {
  const workouts = getWorkouts();
  if (workouts.some((workout) => workout.name.toLowerCase() === input.name.toLowerCase())) {
    return { ok: false, message: "Exercise already exists." };
  }

  const nextWorkout = {
    id: Date.now(),
    name: input.name.trim(),
    reps: input.reps,
    weight_lbs: input.weight_lbs,
  };

  saveWorkouts([...workouts, nextWorkout]);
  return { ok: true };
}

export function updateWorkout(name: string, reps: number, weight_lbs: number) {
  const workouts = getWorkouts();
  saveWorkouts(
    workouts.map((workout) =>
      workout.name.toLowerCase() === name.toLowerCase()
        ? { ...workout, reps, weight_lbs }
        : workout
    )
  );
}

export function deleteWorkouts(names: string[]) {
  const workoutNameSet = new Set(names.map((name) => name.toLowerCase()));
  saveWorkouts(getWorkouts().filter((workout) => !workoutNameSet.has(workout.name.toLowerCase())));
}

export function createRoutine(name: string) {
  const routines = getRoutines();
  if (routines.some((routine) => routine.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, message: "Routine already exists." };
  }

  saveRoutines([
    ...routines,
    { id: Date.now(), name: name.trim(), exerciseNames: [] },
  ]);
  return { ok: true };
}

export function addExercisesToRoutine(routineName: string, exerciseNames: string[]) {
  const routines = getRoutines();
  saveRoutines(
    routines.map((routine) =>
      routine.name.toLowerCase() === routineName.toLowerCase()
        ? {
            ...routine,
            exerciseNames: Array.from(new Set([...routine.exerciseNames, ...exerciseNames])),
          }
        : routine
    )
  );
}

export function removeExercisesFromRoutine(routineName: string, exerciseNames: string[]) {
  const names = new Set(exerciseNames.map((name) => name.toLowerCase()));
  const routines = getRoutines();
  saveRoutines(
    routines.map((routine) =>
      routine.name.toLowerCase() === routineName.toLowerCase()
        ? {
            ...routine,
            exerciseNames: routine.exerciseNames.filter((exerciseName) => !names.has(exerciseName.toLowerCase())),
          }
        : routine
    )
  );
}

export function deleteRoutines(names: string[]) {
  const routineNameSet = new Set(names.map((name) => name.toLowerCase()));
  saveRoutines(getRoutines().filter((routine) => !routineNameSet.has(routine.name.toLowerCase())));
}

export function getRoutineExercises(routineName: string) {
  const routine = getRoutines().find((item) => item.name.toLowerCase() === routineName.toLowerCase());
  if (!routine) {
    return null;
  }

  const workouts = getWorkouts();
  return workouts.filter((workout) =>
    routine.exerciseNames.some((exerciseName) => exerciseName.toLowerCase() === workout.name.toLowerCase())
  );
}
