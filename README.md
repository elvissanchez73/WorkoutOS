# WorkoutOS
A full-stack workout tracking application built with Python, FastAPI, SQLite, and REST APIs to log exercises, manage workout routines, calculate estimated one-rep maxes, and organize reusable exercise history.

## Features

- Add, view, update, and delete exercises
- Store exercise data in SQLite
- Case-insensitive exercise lookup
- Calculate estimated one-rep max
- Create named workout routines
- Add and remove exercises from routines
- View all exercises inside a routine
- Interactive API documentation with FastAPI `/docs`

## Tech Stack

- Python
- FastAPI
- Pydantic
- SQLite
- Uvicorn

## Project Structure

```text
api.py                # FastAPI routes and request/response models
workout_database.py   # SQLite tables and database helper functions
models.py             # Workout class used by the app/database layer
workouts.py           # Terminal menu for local testing
requirements.txt      # Python dependencies
```

## Database Design

The database uses three tables:

```text
workouts
- Stores reusable exercise records

routines
- Stores named workout routines, like Push Day or Leg Day

routine_exercises
- Bridge table connecting routines and exercises
- Allows one routine to contain many exercises
- Allows one exercise to belong to many routines
```

## Setup

Create and activate a virtual environment, then install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run The API

```powershell
uvicorn api:app --reload
```

Open the interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## API Endpoints

### Exercises

```text
GET    /workouts
POST   /workouts
GET    /workouts/{name}
DELETE /workouts/{name}
PUT    /workouts/{name}/reps
PUT    /workouts/{name}/weight
GET    /workouts/{name}/1rm
```

Example `POST /workouts` body:

```json
{
  "name": "Bench Press",
  "reps": 10,
  "weight_lbs": 135
}
```

### Routines

```text
GET    /routines
POST   /routines
DELETE /routines/{routine_name}
POST   /routines/{routine_name}/exercises/{exercise_name}
GET    /routines/{routine_name}/exercises
DELETE /routines/{routine_name}/exercises/{exercise_name}
```

Example `POST /routines` body:

```json
{
  "name": "Push Day"
}
```

## Run The Terminal Menu

The terminal menu is kept as a local testing tool for the database functions:

```powershell
python workouts.py
```

## What I Learned

- How Python classes model application data
- How to save and query data with SQLite
- How to design related tables with foreign keys and a bridge table
- How to build REST API routes with FastAPI
- How to use Pydantic request and response models
- How to return useful HTTP errors with `HTTPException`

## Next Steps

- Build a React or Next.js frontend for the API
- Add automated tests
- Add Docker support
- Deploy the API and frontend
