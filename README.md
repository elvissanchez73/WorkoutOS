# WorkoutOS
A workout tracking application with a Next.js frontend and Vercel-hosted API routes for logging exercises, managing workout routines, calculating estimated one-rep maxes, and organizing reusable exercise history.

The production backend now lives in `frontend/app/api` and uses a managed Postgres database. The Python FastAPI files are still in the repo for reference and local experimentation, but they are no longer the deployment target.

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

- Next.js
- React
- TypeScript
- Vercel route handlers
- Postgres

## Project Structure

```text
frontend/app/api      # Vercel backend routes
frontend/lib          # Shared API URL and database helpers
frontend/app          # Next.js UI pages and components
api.py                # Legacy FastAPI backend
workout_database.py   # Legacy SQLite helpers
requirements.txt      # Python dependencies for the legacy backend
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

## Local Development

For the Vercel-backed app, work inside `frontend/`:

```powershell
cd frontend
npm install
npm run dev
```

Set these environment variables in Vercel for production:

```text
DATABASE_URL=<your Postgres connection string>
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

## Deployment

1. Deploy `frontend/` to Vercel.
2. Add `DATABASE_URL` in the Vercel project settings.
3. Redeploy after any backend route or database schema change.

The API is available under the same deployment at `/api/...`.
