class Workout:
    def __init__(self, name, reps, weight_lbs):
        self.name = name
        self.reps = reps
        self.weight_lbs = weight_lbs

    def calculate_1rm(self):
        if self.reps == 1:
            return self.weight_lbs
        return self.weight_lbs * (1 + self.reps / 30)

    def display_info(self):
        print(
            f"Exercise: {self.name}, Reps: {self.reps}, Weight: {self.weight_lbs} lbs"
        )

    def to_dict(self):
        return {
            "name": self.name,
            "reps": self.reps,
            "weight_lbs": self.weight_lbs,
        }
