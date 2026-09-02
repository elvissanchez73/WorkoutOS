import { sql } from "@vercel/postgres";

export type WorkoutRecord = {
  id: number;
  name: string;
  reps: number;
  weight_lbs: number;
};

export type RoutineRecord = {
  id: number;
  name: string;
};

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS workouts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          reps INTEGER NOT NULL,
          weight_lbs INTEGER NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS routines (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS routine_exercises (
          id SERIAL PRIMARY KEY,
          routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
          workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
          UNIQUE (routine_id, workout_id)
        )
      `;
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS workouts_name_lower_idx
        ON workouts (LOWER(name))
      `;
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS routines_name_lower_idx
        ON routines (LOWER(name))
      `;
    })();
  }

  return schemaReady;
}

function normalizeName(name: string) {
  return name.trim();
}

export async function listWorkouts() {
  await ensureSchema();
  const result = await sql<WorkoutRecord>`
    SELECT id, name, reps, weight_lbs
    FROM workouts
    ORDER BY name
  `;

  return result.rows;
}

export async function getWorkout(name: string) {
  await ensureSchema();
  const result = await sql<WorkoutRecord>`
    SELECT id, name, reps, weight_lbs
    FROM workouts
    WHERE LOWER(name) = LOWER(${normalizeName(name)})
    LIMIT 1
  `;

  return result.rows[0] ?? null;
}

export async function createWorkout(name: string, reps: number, weightLbs: number) {
  await ensureSchema();

  try {
    await sql`
      INSERT INTO workouts (name, reps, weight_lbs)
      VALUES (${normalizeName(name)}, ${reps}, ${weightLbs})
    `;
    return true;
  } catch {
    return false;
  }
}

export async function deleteWorkout(name: string) {
  await ensureSchema();
  const result = await sql`
    DELETE FROM workouts
    WHERE LOWER(name) = LOWER(${normalizeName(name)})
  `;

  return (result.rowCount ?? 0) > 0;
}

export async function updateWorkoutReps(name: string, reps: number) {
  await ensureSchema();
  const result = await sql`
    UPDATE workouts
    SET reps = ${reps}
    WHERE LOWER(name) = LOWER(${normalizeName(name)})
  `;

  return (result.rowCount ?? 0) > 0;
}

export async function updateWorkoutWeight(name: string, weightLbs: number) {
  await ensureSchema();
  const result = await sql`
    UPDATE workouts
    SET weight_lbs = ${weightLbs}
    WHERE LOWER(name) = LOWER(${normalizeName(name)})
  `;

  return (result.rowCount ?? 0) > 0;
}

export async function calculateOneRepMax(name: string) {
  const workout = await getWorkout(name);

  if (!workout) {
    return null;
  }

  return workout.weight_lbs * (1 + workout.reps / 30);
}

export async function listRoutines() {
  await ensureSchema();
  const result = await sql<RoutineRecord>`
    SELECT id, name
    FROM routines
    ORDER BY name
  `;

  return result.rows;
}

export async function createRoutine(name: string) {
  await ensureSchema();

  try {
    await sql`
      INSERT INTO routines (name)
      VALUES (${normalizeName(name)})
    `;
    return true;
  } catch {
    return false;
  }
}

export async function deleteRoutine(name: string) {
  await ensureSchema();
  const result = await sql`
    DELETE FROM routines
    WHERE LOWER(name) = LOWER(${normalizeName(name)})
  `;

  return (result.rowCount ?? 0) > 0;
}

export async function addExerciseToRoutine(routineName: string, exerciseName: string) {
  await ensureSchema();

  const routineResult = await sql<{ id: number }>`
    SELECT id
    FROM routines
    WHERE LOWER(name) = LOWER(${normalizeName(routineName)})
    LIMIT 1
  `;
  const routineId = routineResult.rows[0]?.id;

  if (!routineId) {
    return false;
  }

  const workoutResult = await sql<{ id: number }>`
    SELECT id
    FROM workouts
    WHERE LOWER(name) = LOWER(${normalizeName(exerciseName)})
    LIMIT 1
  `;
  const workoutId = workoutResult.rows[0]?.id;

  if (!workoutId) {
    return false;
  }

  try {
    await sql`
      INSERT INTO routine_exercises (routine_id, workout_id)
      VALUES (${routineId}, ${workoutId})
    `;
    return true;
  } catch {
    return false;
  }
}

export async function listRoutineExercises(routineName: string) {
  await ensureSchema();

  const routineResult = await sql<{ id: number }>`
    SELECT id
    FROM routines
    WHERE LOWER(name) = LOWER(${normalizeName(routineName)})
    LIMIT 1
  `;
  const routineId = routineResult.rows[0]?.id;

  if (!routineId) {
    return null;
  }

  const result = await sql<WorkoutRecord>`
    SELECT w.id, w.name, w.reps, w.weight_lbs
    FROM workouts w
    INNER JOIN routine_exercises re ON w.id = re.workout_id
    WHERE re.routine_id = ${routineId}
    ORDER BY w.name
  `;

  return result.rows;
}

export async function removeExerciseFromRoutine(routineName: string, exerciseName: string) {
  await ensureSchema();

  const routineResult = await sql<{ id: number }>`
    SELECT id
    FROM routines
    WHERE LOWER(name) = LOWER(${normalizeName(routineName)})
    LIMIT 1
  `;
  const routineId = routineResult.rows[0]?.id;

  if (!routineId) {
    return false;
  }

  const workoutResult = await sql<{ id: number }>`
    SELECT id
    FROM workouts
    WHERE LOWER(name) = LOWER(${normalizeName(exerciseName)})
    LIMIT 1
  `;
  const workoutId = workoutResult.rows[0]?.id;

  if (!workoutId) {
    return false;
  }

  const result = await sql`
    DELETE FROM routine_exercises
    WHERE routine_id = ${routineId} AND workout_id = ${workoutId}
  `;

  return (result.rowCount ?? 0) > 0;
}