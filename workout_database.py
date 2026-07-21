import sqlite3
from models import Workout

DB_NAME = "gym_tracker.db"


def create_table():
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        # Stores the exercise inventory. Each row is one exercise that can be reused.
        c.execute("""CREATE TABLE IF NOT EXISTS workouts(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL UNIQUE COLLATE NOCASE,
              reps INTEGER,
              weight_lbs INTEGER)""")

        # Stores named workout routines, such as "Push Day" or "Leg Day".
        c.execute("""CREATE TABLE IF NOT EXISTS routines(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE COLLATE NOCASE)""")

        # Bridge table for a many-to-many relationship:
        # one routine can contain many exercises, and one exercise can belong to many routines.
        # FOREIGN KEY columns store IDs from the parent tables so each link points to real rows.
        c.execute("""CREATE TABLE IF NOT EXISTS routine_exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                routine_id INTEGER NOT NULL,
                workout_id INTEGER NOT NULL,
                FOREIGN KEY (routine_id) REFERENCES routines(id),
                FOREIGN KEY (workout_id) REFERENCES workouts(id),
                UNIQUE (routine_id, workout_id))""")


create_table()


# exercise functions
def row_to_dict(row):
    workout_id, name, reps, weight_lbs = row
    return {
        "id": workout_id,
        "name": name,
        "reps": reps,
        "weight_lbs": weight_lbs,
    }


def insert_workout(workout):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        try:
            c.execute(
                "SELECT id FROM workouts WHERE name=:name COLLATE NOCASE",
                {"name": workout.name},
            )
            if c.fetchone():
                return False

            c.execute(
                "INSERT INTO workouts (name, reps, weight_lbs) VALUES (:name, :reps, :weight_lbs)",
                {
                    "name": workout.name,
                    "reps": workout.reps,
                    "weight_lbs": workout.weight_lbs,
                },
            )
            return True
        except sqlite3.IntegrityError as error:
            # Gracefully intercepting a duplicate or key constraint violation
            print(f"Skipped insertion: {error}")
            return False


def remove_workout(name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "DELETE FROM workouts WHERE name=:name COLLATE NOCASE", {"name": name}
        )
        return c.rowcount > 0


def update_reps(name, new_reps):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "UPDATE workouts SET reps=:new_reps WHERE name=:name COLLATE NOCASE",
            {"new_reps": new_reps, "name": name},
        )
        return c.rowcount > 0


def update_weight(name, new_weight):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "UPDATE workouts SET weight_lbs=:new_weight WHERE name=:name COLLATE NOCASE",
            {"new_weight": new_weight, "name": name},
        )
        return c.rowcount > 0


def get_all_workouts():
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM workouts")
        rows = c.fetchall()
        return [row_to_dict(row) for row in rows]


def get_info_workout(name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id, name, reps, weight_lbs FROM workouts WHERE name=:name COLLATE NOCASE",
            {"name": name},
        )
        row = c.fetchone()

    if row:
        return row_to_dict(row)

    return None


def calculate_1rep_max(name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT reps, weight_lbs FROM workouts WHERE name=:name COLLATE NOCASE",
            {"name": name},
        )
        result = c.fetchone()
    if result:
        reps, weight = result
        one_rm = weight * (1 + reps / 30)
        return one_rm
    else:
        return None


# routine functions
def create_routine(name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        try:
            c.execute(
                "INSERT INTO routines (name) VALUES (:name)",
                {"name": name},
            )
            return True
        except sqlite3.IntegrityError as error:
            print(f"Skipped insertion: {error}")
            return False


def add_exercise_to_routine(routine_name, exercise_name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id FROM routines WHERE name=:routine_name COLLATE NOCASE",
            {"routine_name": routine_name},
        )
        routine_id = c.fetchone()
        if not routine_id:
            return False

        c.execute(
            "SELECT id FROM workouts WHERE name=:exercise_name COLLATE NOCASE",
            {"exercise_name": exercise_name},
        )
        workout_id = c.fetchone()
        if not workout_id:
            return False

        try:
            c.execute(
                "INSERT INTO routine_exercises (routine_id, workout_id) VALUES (:routine_id, :workout_id)",
                {"routine_id": routine_id[0], "workout_id": workout_id[0]},
            )
            return True
        except sqlite3.IntegrityError as error:
            print(f"Skipped insertion: {error}")
            return False


def get_routine_exercises(routine_name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id FROM routines WHERE name=:routine_name COLLATE NOCASE",
            {"routine_name": routine_name},
        )
        routine_id = c.fetchone()
        if not routine_id:
            return None

        c.execute(
            """SELECT w.id, w.name, w.reps, w.weight_lbs
               FROM workouts w
               JOIN routine_exercises re ON w.id = re.workout_id
               WHERE re.routine_id = :routine_id""",
            {"routine_id": routine_id[0]},
        )
        rows = c.fetchall()
        return [row_to_dict(row) for row in rows]


def remove_exercise_from_routine(routine_name, exercise_name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id FROM routines WHERE name=:routine_name COLLATE NOCASE",
            {"routine_name": routine_name},
        )
        routine_id = c.fetchone()
        if not routine_id:
            return False

        c.execute(
            "SELECT id FROM workouts WHERE name=:exercise_name COLLATE NOCASE",
            {"exercise_name": exercise_name},
        )
        workout_id = c.fetchone()
        if not workout_id:
            return False

        c.execute(
            "DELETE FROM routine_exercises WHERE routine_id=:routine_id AND workout_id=:workout_id",
            {"routine_id": routine_id[0], "workout_id": workout_id[0]},
        )
        return c.rowcount > 0


def get_all_routines():
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM routines")
        rows = c.fetchall()
        return [{"id": row[0], "name": row[1]} for row in rows]


def remove_routine(routine_name):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT id FROM routines WHERE name=:routine_name COLLATE NOCASE",
            {"routine_name": routine_name},
        )
        routine_id = c.fetchone()
        if not routine_id:
            return False

        c.execute(
            "DELETE FROM routine_exercises WHERE routine_id=:routine_id",
            {"routine_id": routine_id[0]},
        )

        c.execute(
            """DELETE FROM routines WHERE name=:routine_name COLLATE NOCASE""",
            {"routine_name": routine_name},
        )
        return c.rowcount > 0


if __name__ == "__main__":
    print(get_all_workouts())
