# HANDOFF.md — Project Status

## Project
Role-Based Task Manager (Internship Assignment)

## Stack
- **Backend**: Node.js, Express 5, Mongoose 9, JWT (7d), bcrypt (10 rounds)
- **Mobile**: Expo SDK 54, React Navigation 7, Axios, AsyncStorage

## Current Status: [BACKEND ✅ COMPLETE] [MOBILE ✅ COMPLETE]

---

## Environment Setup

### Backend (`/backend/.env`)
Already configured — contains real MongoDB Atlas URI and generated JWT_SECRET.

### Mobile (`/mobile/.env`)
```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```
> Find your IP: run `ipconfig` on Windows, use the IPv4 address of your active adapter (e.g., `192.168.x.x`).

---

## Backend API (http://localhost:5000/api)

| Route | Method | Auth | Role |
|---|---|---|---|
| `/auth/signup` | POST | ❌ | any |
| `/auth/login` | POST | ❌ | any |
| `/auth/me` | GET | ✅ | any |
| `/tasks` | GET | ✅ | any (filtered by role) |
| `/tasks` | POST | ✅ | admin |
| `/tasks/:id` | GET | ✅ | any (user restricted) |
| `/tasks/:id` | PUT | ✅ | any (user = status only) |
| `/tasks/:id` | DELETE | ✅ | admin |
| `/users` | GET | ✅ | admin |
| `/users/:id` | GET | ✅ | admin |

---

## Mobile App Screens

| Screen | File | Role |
|---|---|---|
| Login | `LoginScreen.js` | public |
| Task List | `TaskListScreen.js` | all (filtered) |
| Task Detail | `TaskDetailScreen.js` | all (RBAC inline) |
| Create Task | `CreateTaskScreen.js` | admin tab |
| Manage Users | `ManageUsersScreen.js` | admin tab |
| Profile | `ProfileScreen.js` | all |

---

## Test Credentials
| Email | Password | Role |
|---|---|---|
| `admin@test.com` | `admin123` | admin |
| `user1@test.com` | `user123` | user |
| `user2@test.com` | `user123` | user |
| `user3@test.com` | `user123` | user |

---

## How to Run

### Backend
```bash
cd backend
npm run dev
```

### Mobile
```bash
cd mobile
# Set your IP in mobile/.env first!
npx expo start
# Scan QR with Expo Go app
```

---

## Completed
- [x] Backend: Models, Middleware, Controllers, Routes
- [x] Backend: Seeded with test data
- [x] Backend: Connected to MongoDB Atlas
- [x] Mobile: Expo scaffold + all deps
- [x] Mobile: Auth context + JWT persistence
- [x] Mobile: Role-gated navigation (user 2 tabs, admin 4 tabs)
- [x] Mobile: All 6 screens built
- [x] Mobile: All components built
- [x] GitHub: Code pushed to main branch

## Next Steps
1. Set local IP in `mobile/.env`
2. Run both backend and mobile
3. Test with Expo Go on your phone
