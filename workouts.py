from models import Workout
from workout_database import (
    add_exercise_to_routine,
    create_routine,
    get_all_workouts,
    get_all_routines,
    get_info_workout,
    get_routine_exercises,
    insert_workout,
    remove_exercise_from_routine,
    remove_routine,
    remove_workout,
    update_reps,
    update_weight,
    calculate_1rep_max,
)


def menu():
    print("Exercise Menu:")
    print("1. View Workouts")
    print("2. Add Exercise")
    print("3. Delete Exercise")
    print("4. Update Reps")
    print("5. Update Weight")
    print("6. Calculate 1 Rep Max")
    print("7. Show information of a single exercise")
    print("8. View Routines")
    print("9. Create Routine")
    print("10. Delete Routine")
    print("11. Add Exercise To Routine")
    print("12. View Routine Exercises")
    print("13. Remove Exercise From Routine")
    print("14. Exit")
    return input("Select an option (1-14): ")


def get_integer_input(prompt):
    while True:
        try:
            value = int(input(prompt))
            return value
        except ValueError:
            print("Invalid input. Please enter a valid integer.")


def main():
    while True:
        choice = menu()
        if choice == "1":
            result = get_all_workouts()
            for workout in result:
                print(
                    f"Exercise #{workout['id']}: {workout['name']}, Reps: {workout['reps']}, Weight: {workout['weight_lbs']} lbs"
                )

        elif choice == "2":
            name = input("Enter the name of the the new exercise: ")
            exercise = get_info_workout(name)

            if exercise:
                print("Exercise already exists.")
                continue
            reps = get_integer_input("How many raps can you do if this exercise? ")
            weight = get_integer_input(
                "How much weight in lbs can you lift for this exercise? "
            )
            new_exercise = Workout(name, reps, weight)
            success = insert_workout(new_exercise)

            if success:
                print(f"Exercise {name} added with {reps} reps and {weight} lbs.")
            else:
                print("Failed to add exercise.")

        elif choice == "3":
            name = input("Enter the name of the exercise to delete: ")
            success = remove_workout(name)
            if success:
                print("Exercise deleted.")
            else:
                print("Exercise not found.")
        elif choice == "4":
            name = input("Enter the name of the exercise to update reps: ")

            new_reps = get_integer_input("Enter new number of reps: ")
            success = update_reps(name, new_reps)
            if success:
                print(f"Reps updated to {new_reps}.")
            else:
                print("Failed to update reps.")

        elif choice == "5":
            name = input("Enter the name of the exercise to update weight: ")

            new_weight = get_integer_input("Enter new weight in lbs: ")
            success = update_weight(name, new_weight)
            if success:
                print(f"Weight updated to {new_weight} lbs.")
            else:
                print("Failed to update weight.")

        elif choice == "6":
            name = input("Enter the name of the exercise to calculate 1RM: ")
            exercise = get_info_workout(name)
            if exercise:
                success = calculate_1rep_max(name)
                if success is not None:
                    print(f"Estimated 1 Rep Max: {success:.2f} lbs")
                else:
                    print("Failed to calculate 1RM.")
            else:
                print("Exercise not found.")
        elif choice == "7":
            name = input("Enter the name of the exercise to view information: ")
            exercise = get_info_workout(name)
            if exercise:
                print(
                    f"Exercise #{exercise['id']}: {exercise['name']}, Reps: {exercise['reps']}, Weight: {exercise['weight_lbs']} lbs"
                )
            else:
                print("Exercise not found.")
        elif choice == "8":
            routines = get_all_routines()
            for routine in routines:
                print(f"Routine #{routine['id']}: {routine['name']}")

        elif choice == "9":
            routine_name = input("Enter the name of the new routine: ")
            success = create_routine(routine_name)
            if success:
                print(f"Routine {routine_name} created.")
            else:
                print("Routine already exists.")

        elif choice == "10":
            routine_name = input("Enter the name of the routine to delete: ")
            success = remove_routine(routine_name)
            if success:
                print(f"Routine {routine_name} deleted.")
            else:
                print("Routine not found.")

        elif choice == "11":
            routine_name = input("Enter the routine name: ")
            exercise_name = input("Enter the exercise name to add: ")
            success = add_exercise_to_routine(routine_name, exercise_name)
            if success:
                print(f"Exercise {exercise_name} added to routine {routine_name}.")
            else:
                print(
                    "Routine or exercise not found, or exercise already exists in routine."
                )

        elif choice == "12":
            routine_name = input("Enter the routine name to view: ")
            exercises = get_routine_exercises(routine_name)
            if exercises is None:
                print("Routine not found.")
            elif exercises:
                for exercise in exercises:
                    print(
                        f"Exercise #{exercise['id']}: {exercise['name']}, Reps: {exercise['reps']}, Weight: {exercise['weight_lbs']} lbs"
                    )
            else:
                print("Routine has no exercises yet.")

        elif choice == "13":
            routine_name = input("Enter the routine name: ")
            exercise_name = input("Enter the exercise name to remove: ")
            success = remove_exercise_from_routine(routine_name, exercise_name)
            if success:
                print(f"Exercise {exercise_name} removed from routine {routine_name}.")
            else:
                print("Routine or exercise relationship not found.")

        elif choice == "14":
            print("Exiting the program.")
            break
        else:
            print("Invalid option. Please select a number between 1 and 14.")


if __name__ == "__main__":
    main()
