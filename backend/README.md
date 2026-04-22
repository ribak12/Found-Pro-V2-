# Oasis Healthcare Backend

## Setup

1. Create a `.env` file from `.env.example`
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5001/api/lab-reports/seed-demo` once to seed demo lab reports

## Main endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/appointments`
- `GET /api/appointments/my`
- `GET /api/lab-reports/check`
- `GET /api/lab-reports/seed-demo`
