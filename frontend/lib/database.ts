import { Pool } from "pg";

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
let pool: Pool | null = null;

function getPool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local and to Vercel environment variables.");
  }

  pool = new Pool({
    connectionString,
    ssl:
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  return pool;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getPool();

      await db.query(`
        CREATE TABLE IF NOT EXISTS workouts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          reps INTEGER NOT NULL,
          weight_lbs INTEGER NOT NULL
        )
      `);
      await db.query(`
        CREATE TABLE IF NOT EXISTS routines (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL
        )
      `);
      await db.query(`
        CREATE TABLE IF NOT EXISTS routine_exercises (
          id SERIAL PRIMARY KEY,
          routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
          workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
          UNIQUE (routine_id, workout_id)
        )
      `);
      await db.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS workouts_name_lower_idx
        ON workouts (LOWER(name))
      `);
      await db.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS routines_name_lower_idx
        ON routines (LOWER(name))
      `);
    })();
  }

  return schemaReady;
}

function normalizeName(name: string) {
  return name.trim();
}

export async function listWorkouts() {
  await ensureSchema();
  const result = await getPool().query<WorkoutRecord>(`
    SELECT id, name, reps, weight_lbs
    FROM workouts
    ORDER BY name
  `);

  return result.rows;
}

export async function getWorkout(name: string) {
  await ensureSchema();
  const result = await getPool().query<WorkoutRecord>(`
    SELECT id, name, reps, weight_lbs
    FROM workouts
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `, [normalizeName(name)]);

  return result.rows[0] ?? null;
}

export async function createWorkout(name: string, reps: number, weightLbs: number) {
  await ensureSchema();
  await getPool().query(`
    INSERT INTO workouts (name, reps, weight_lbs)
    VALUES ($1, $2, $3)
  `, [normalizeName(name), reps, weightLbs]);

  return true;
}

export async function deleteWorkout(name: string) {
  await ensureSchema();
  const result = await getPool().query(`
    DELETE FROM workouts
    WHERE LOWER(name) = LOWER($1)
  `, [normalizeName(name)]);

  return (result.rowCount ?? 0) > 0;
}

export async function updateWorkoutReps(name: string, reps: number) {
  await ensureSchema();
  const result = await getPool().query(`
    UPDATE workouts
    SET reps = $1
    WHERE LOWER(name) = LOWER($2)
  `, [reps, normalizeName(name)]);

  return (result.rowCount ?? 0) > 0;
}

export async function updateWorkoutWeight(name: string, weightLbs: number) {
  await ensureSchema();
  const result = await getPool().query(`
    UPDATE workouts
    SET weight_lbs = $1
    WHERE LOWER(name) = LOWER($2)
  `, [weightLbs, normalizeName(name)]);

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
  const result = await getPool().query<RoutineRecord>(`
    SELECT id, name
    FROM routines
    ORDER BY name
  `);

  return result.rows;
}

export async function createRoutine(name: string) {
  await ensureSchema();
  await getPool().query(`
    INSERT INTO routines (name)
    VALUES ($1)
  `, [normalizeName(name)]);

  return true;
}

export async function deleteRoutine(name: string) {
  await ensureSchema();
  const result = await getPool().query(`
    DELETE FROM routines
    WHERE LOWER(name) = LOWER($1)
  `, [normalizeName(name)]);

  return (result.rowCount ?? 0) > 0;
}

export async function addExerciseToRoutine(routineName: string, exerciseName: string) {
  await ensureSchema();

  const routineResult = await getPool().query<{ id: number }>(`
    SELECT id
    FROM routines
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `, [normalizeName(routineName)]);
  const routineId = routineResult.rows[0]?.id;

  if (!routineId) {
    return false;
  }

  const workoutResult = await getPool().query<{ id: number }>(`
    SELECT id
    FROM workouts
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `, [normalizeName(exerciseName)]);
  const workoutId = workoutResult.rows[0]?.id;

  if (!workoutId) {
    return false;
  }

  await getPool().query(`
    INSERT INTO routine_exercises (routine_id, workout_id)
    VALUES ($1, $2)
  `, [routineId, workoutId]);

  return true;
}

export async function listRoutineExercises(routineName: string) {
  await ensureSchema();

  const routineResult = await getPool().query<{ id: number }>(`
    SELECT id
    FROM routines
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `, [normalizeName(routineName)]);
  const routineId = routineResult.rows[0]?.id;

  if (!routineId) {
    return null;
  }

  const result = await getPool().query<WorkoutRecord>(`
    SELECT w.id, w.name, w.reps, w.weight_lbs
    FROM workouts w
    INNER JOIN routine_exercises re ON w.id = re.workout_id
    WHERE re.routine_id = $1
    ORDER BY w.name
  `, [routineId]);

  return result.rows;
}

export async function removeExerciseFromRoutine(routineName: string, exerciseName: string) {
  await ensureSchema();

  const routineResult = await getPool().query<{ id: number }>(`
    SELECT id
    FROM routines
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `, [normalizeName(routineName)]);
  const routineId = routineResult.rows[0]?.id;

  if (!routineId) {
    return false;
  }

  const workoutResult = await getPool().query<{ id: number }>(`
    SELECT id
    FROM workouts
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `, [normalizeName(exerciseName)]);
  const workoutId = workoutResult.rows[0]?.id;

  if (!workoutId) {
    return false;
  }

  const result = await getPool().query(`
    DELETE FROM routine_exercises
    WHERE routine_id = $1 AND workout_id = $2
  `, [routineId, workoutId]);

  return (result.rowCount ?? 0) > 0;
}