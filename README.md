# TaskFlow — Role-Based Task Manager

A full-stack task management application with **role-based access control (RBAC)**.  
Backend: Node.js + Express + MongoDB Atlas  
Mobile: React Native (Expo SDK 54)

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Mobile Setup](#mobile-setup)
- [Test Credentials](#test-credentials)
- [API Reference](#api-reference)
- [Building the APK](#building-the-apk)
- [CORS & Network Notes](#cors--network-notes)

---

## Features

### Authentication
- [x] JWT-based login (7-day token)
- [x] Password hashed with bcrypt (10 rounds)
- [x] Password field never returned in any API response
- [x] Token persisted across app restarts via AsyncStorage
- [x] Auto-logout on 401 (expired/invalid token)
- [x] Wrong-password returns 401 with generic message (no enumeration)

### Role-Based Access Control
- [x] **Admin**: sees all tasks, can create / edit / delete any task
- [x] **User**: sees only tasks assigned to them, can only update status (pending → in-progress → completed)
- [x] User cannot create tasks (403)
- [x] User cannot edit a task assigned to someone else (403)
- [x] Role-gated bottom tab navigation (admin gets 4 tabs, user gets 2)

### Task Management
- [x] Task list with pull-to-refresh
- [x] Filter pills: All / Pending / In Progress / Completed
- [x] Search by title (client-side, instant)
- [x] Task detail with full metadata (priority, due date, assignee, creator)
- [x] Admin: create task with title, description, priority, assignee, due date
- [x] Admin: edit any task field inline on detail screen
- [x] Admin: delete task with confirmation dialog
- [x] User: mark task in-progress then completed

### Mobile UX
- [x] Dark mode themed UI throughout
- [x] Loading states and empty states on all screens
- [x] Error messages displayed inline (not just console)
- [x] Logout on Profile tab clears session

---

## Project Structure

```
assignmen/
├── backend/                  # Node.js/Express REST API
│   ├── controllers/
│   │   ├── authController.js # Signup, login, /me
│   │   ├── taskController.js # CRUD with RBAC
│   │   └── userController.js # List users (admin)
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── role.js           # requireRole() factory
│   │   └── validate.js       # express-validator helper
│   ├── models/
│   │   ├── User.js           # name, email, password(select:false), role
│   │   └── Task.js           # title, status, priority, assignedTo, createdBy
│   ├── routes/
│   │   ├── auth.js           # /api/auth/*
│   │   ├── tasks.js          # /api/tasks/*
│   │   └── users.js          # /api/users/*
│   ├── seed.js               # Creates 1 admin + 3 users + 5 tasks (idempotent)
│   ├── server.js             # Express app entry point
│   ├── .env.example          # Template — copy to .env and fill
│   └── test_api.ps1          # PowerShell end-to-end API test script
│
└── mobile/                   # Expo React Native app
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js     # Auth state + AsyncStorage persistence
    │   ├── navigation/
    │   │   └── AppNavigator.js    # Stack + 2-tab/4-tab bottom nav by role
    │   ├── screens/
    │   │   ├── LoginScreen.js
    │   │   ├── TaskListScreen.js  # Filter pills + search + pull-to-refresh
    │   │   ├── TaskDetailScreen.js# View/edit/delete (RBAC inline)
    │   │   ├── CreateTaskScreen.js# Admin only
    │   │   ├── ManageUsersScreen.js
    │   │   └── ProfileScreen.js   # Shows role badge + logout
    │   ├── components/
    │   │   ├── TaskCard.js
    │   │   ├── AppHeader.js
    │   │   ├── LoadingScreen.js
    │   │   └── EmptyState.js
    │   ├── services/
    │   │   └── api.js             # Axios instance + interceptors
    │   └── theme.js               # Design tokens (colors, spacing, etc.)
    ├── app.json
    ├── eas.json                   # EAS Build config for APK
    └── .env.example
```

---

## Backend Setup

### Prerequisites
- Node.js >= 18
- A MongoDB Atlas cluster (or local MongoDB)

### Steps

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — fill in MONGO_URI and generate JWT_SECRET
# Example JWT_SECRET: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 3. Seed the database (creates users + 5 tasks, idempotent — safe to run again)
node seed.js

# 4. Start the development server
npm run dev
# Server starts on http://localhost:5000
```

### Environment Variables (`backend/.env`)

| Variable     | Required | Description |
|-------------|----------|-------------|
| `PORT`       | No (default 5000) | Port to listen on |
| `MONGO_URI`  | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Random 32-byte base64 string |

---

## Mobile Setup

### Prerequisites
- Node.js >= 18
- Expo Go app on your Android/iOS device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Both phone and PC on the **same Wi-Fi network**

### Steps

```bash
# 1. Find your PC's local IP address
#    Windows: run `ipconfig` -> look for IPv4 under your active adapter
#    e.g. 192.168.1.42

# 2. Set the API URL
cd mobile
# Edit mobile/.env:
#   EXPO_PUBLIC_API_URL=http://<YOUR_IP>:5000

# 3. Install dependencies
npm install

# 4. Start Expo
npx expo start

# 5. Scan the QR code with Expo Go app on your phone
```

### Environment Variables (`mobile/.env`)

| Variable                | Description |
|------------------------|-------------|
| `EXPO_PUBLIC_API_URL`  | Full URL to the backend, e.g. `http://192.168.1.42:5000` |

> **Important:** Use your LAN IP address, not `localhost`. `localhost` on a phone refers to the phone itself, not your PC.

---

## Test Credentials

| Email             | Password  | Role  |
|------------------|-----------|-------|
| admin@test.com   | admin123  | admin |
| user1@test.com   | user123   | user  |
| user2@test.com   | user123   | user  |
| user3@test.com   | user123   | user  |

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Route              | Auth | Role  | Description |
|--------|--------------------|------|-------|-------------|
| POST   | /auth/signup       | No   | Any   | Create account |
| POST   | /auth/login        | No   | Any   | Get JWT token |
| GET    | /auth/me           | Yes  | Any   | Get current user |
| GET    | /tasks             | Yes  | Any   | List tasks (admin=all, user=own) |
| POST   | /tasks             | Yes  | Admin | Create task |
| GET    | /tasks/:id         | Yes  | Any   | Get task (user restricted to own) |
| PUT    | /tasks/:id         | Yes  | Any   | Update task (user=status only) |
| DELETE | /tasks/:id         | Yes  | Admin | Delete task |
| GET    | /users             | Yes  | Admin | List all users |
| GET    | /users/:id         | Yes  | Admin | Get user by ID |

### Quick API Test (PowerShell)

```powershell
# Start server first: cd backend && node server.js
cd backend
.\test_api.ps1
# Expected: PASSED: 16 | FAILED: 0
```

---

## Building the APK

The project is configured for [EAS Build](https://docs.expo.dev/build/introduction/) (Expo's cloud build service). You need a free Expo account.

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build a local APK preview (no Expo account needed for local build)
cd mobile
npx expo run:android    # requires Android Studio + SDK

# OR build in the cloud (free tier):
eas build --platform android --profile preview
# Download the .apk from expo.dev when complete
```

The `eas.json` in `mobile/` is pre-configured with a `preview` profile that produces a directly-installable `.apk` (not `.aab`).

### Installing the APK on Android

1. Enable **Install from unknown sources** in Android Settings > Security
2. Transfer the `.apk` to the device (USB / Google Drive / email)
3. Tap the file to install

---

## Running Backend API Tests

```powershell
# With server already running on port 5000:
cd backend
.\test_api.ps1
```

Tests cover:
- Admin login → token + role check
- User login → token + role check  
- Wrong password → 401
- Admin GET /tasks → all 5 tasks with populated names
- User GET /tasks → only assigned tasks
- User POST /tasks → 403
- User PUT task not theirs → 403
- No password field leaked in any response

---

## CORS & Network Notes

- The backend allows **all origins** (`cors({ origin: "*" })`). This is intentional for local development / demonstration. Restrict to your frontend domain in production.
- Mobile **must** use your PC's LAN IP (`192.168.x.x`), not `localhost`. Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find it.
- Both devices must be on the **same network** (same Wi-Fi router). Mobile hotspot sharing from PC to phone will NOT work because the phone won't be able to reach the PC's port 5000.
- If you change networks, update `EXPO_PUBLIC_API_URL` in `mobile/.env` and restart Expo.
