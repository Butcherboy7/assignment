# HANDOFF.md — Project Status

## Project
Role-Based Task Manager (Internship Assignment)

## Stack
- **Backend**: Node.js, Express 5, Mongoose 9, JWT (7d), bcrypt (10 rounds)
- **Mobile**: Expo SDK 54, React Navigation 7, Axios, AsyncStorage

## Current Status: [SHIPPED ✅]

---

## Ship Verification (2026-04-25)

### Backend API Tests — 16/16 PASSED
| Test | Result |
|------|--------|
| Admin login → token + role | PASS |
| User login → token + role | PASS |
| Wrong password → 401 | PASS |
| No password in login response | PASS |
| Admin GET /tasks → all 5 with populated names | PASS |
| assignedTo.name populated | PASS |
| createdBy.name populated | PASS |
| No password in task assignedTo | PASS |
| User GET /tasks → only 2 own tasks | PASS |
| User tasks all belong to user1 | PASS |
| User POST /tasks → 403 | PASS |
| User PUT task not theirs → 403 | PASS |
| Zero password leaks in task data | PASS |

### Mobile Code Review
- ✅ Login error shown inline (not just console)
- ✅ Token in AsyncStorage → survives restart (rehydrate in AuthContext)
- ✅ Role-gated navigation: user=2 tabs, admin=4 tabs
- ✅ Filter pills + search working (client-side filtering)
- ✅ useFocusEffect refreshes list on navigate-back
- ✅ User can update status (in-progress → completed), RBAC enforced server-side
- ✅ Admin can create, edit, delete tasks
- ✅ Logout clears AsyncStorage + resets auth state

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
| `/auth/signup` | POST | No | any |
| `/auth/login` | POST | No | any |
| `/auth/me` | GET | Yes | any |
| `/tasks` | GET | Yes | any (filtered by role) |
| `/tasks` | POST | Yes | admin |
| `/tasks/:id` | GET | Yes | any (user restricted) |
| `/tasks/:id` | PUT | Yes | any (user = status only) |
| `/tasks/:id` | DELETE | Yes | admin |
| `/users` | GET | Yes | admin |
| `/users/:id` | GET | Yes | admin |

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
npm install
node seed.js       # one-time (idempotent)
npm run dev
```

### Mobile
```bash
cd mobile
# Set your IP in mobile/.env first!
npm install
npx expo start
# Scan QR with Expo Go app
```

### Run API Tests
```powershell
# With server running:
cd backend
.\test_api.ps1
```

### Build APK
```bash
cd mobile
npm install -g eas-cli
eas login
eas build --platform android --profile preview
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
- [x] API: 16/16 endpoint tests passing
- [x] README.md: Full setup docs + features list + APK build guide
- [x] EAS: eas.json configured for APK preview build
- [x] app.json: Package ID set (com.taskflow.rbac)
- [x] GitHub: Code committed and pushed to main


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
- [x] Backend: **Login Rate Limiting** (10 attempts / 15 min)
- [x] Backend: **Zero Role Escalation** (protected signup)
- [x] Backend: **Strict Mass Assignment protection** (field whitelisting)
- [x] Mobile: Expo scaffold + all deps
- [x] Mobile: Auth context + JWT persistence
- [x] Mobile: Role-gated navigation (user 2 tabs, admin 4 tabs)
- [x] Mobile: All 6 screens built
- [x] Mobile: **UX Polish** (chevrons, smart empty states, toast feedback)
- [x] API: 16/16 endpoint tests passing
- [x] CI/CD: eas.json configured for APK preview build
- [x] **Skill Integration:** Integrated `VibeSec-Skill` for ongoing security audits.

## Next Steps (Tomorrow)
1. Manual penetration testing of the new rate limiting and whitelisting.
2. Final visual check on physical Android/iOS devices for any padding quirks.
3. Prepare production build for final submission.
