# HANDOFF.md — Project Status

## Project
Role-Based Task Manager (Internship Assignment)

## Stack
- **Backend**: Node.js, Express 5, Mongoose 9, JWT, bcrypt
- **Mobile**: Expo (Pending)

## Current Status: [BACKEND COMPLETE ✅]
The backend is fully operational, connected to MongoDB Atlas, and seeded with test data.

## Environment Setup
- **Backend**: `.env` is already configured with your MongoDB URI and JWT_SECRET.
- **Mobile**: (Next Phase) Will need `EXPO_PUBLIC_API_URL`.

## API Endpoints (Base: http://localhost:5000/api)
- `POST /auth/signup` / `POST /auth/login` (Public)
- `GET /tasks` (Auth: Admin sees all, User sees assigned)
- `PUT /tasks/:id` (Auth: Admin all fields, User status only)
- `GET /users` (Auth: Admin only)

## Completed
- [x] Backend folder structure & initialization
- [x] Database schemas (User, Task)
- [x] Authentication & Role-based middleware
- [x] Task & User Controllers (RBAC logic included)
- [x] Seed script for test data
- [x] Database connection & Server validation

## Test Credentials
| Email | Password | Role |
|---|---|---|
| `admin@test.com` | `admin123` | admin |
| `user1@test.com` | `user123` | user |

## Next Steps
1. Start **Prompt 2** (Mobile App) development.
2. Connect Mobile App to the existing Backend API.
