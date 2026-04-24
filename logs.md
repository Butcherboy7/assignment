# LOGS.md — Session Activity Log

> Tracks everything done in this project session chronologically.

---

## Session 1 — 2026-04-25

### Phase 1: Backend Setup

| Time (approx) | Action |
|---|---|
| 02:38 | Checked Node.js (v22), npm (v10) — already installed |
| 02:40 | Detected `nodemon` missing → installed globally via `npm install -g nodemon` |
| 02:40 | `npm init -y` in `/backend` |
| 02:41 | Installed all 7 backend packages (express, mongoose, jsonwebtoken, bcrypt, cors, dotenv, express-validator) |
| 02:41 | Created all directory structure (models, middleware, routes, controllers) |
| 02:42 | Wrote `models/User.js` — name, email, password(select:false), role |
| 02:42 | Wrote `models/Task.js` — full task schema with enums |
| 02:43 | Wrote `middleware/auth.js` — JWT Bearer verification |
| 02:43 | Wrote `middleware/role.js` — `requireRole(...roles)` factory |
| 02:43 | Wrote `middleware/validate.js` — express-validator handler |
| 02:44 | Wrote `controllers/authController.js` — signup, login, getMe with validation arrays |
| 02:44 | Wrote `controllers/taskController.js` — full CRUD with RBAC logic |
| 02:44 | Wrote `controllers/userController.js` — admin-only user queries |
| 02:44 | Wrote `routes/auth.js`, `routes/tasks.js`, `routes/users.js` |
| 02:44 | Wrote `server.js` — CORS, JSON, routes, 404, error handler, DB bootstrap |
| 02:44 | Created `.env.example` |
| 02:44 | Wrote `seed.js` — idempotent, 1 admin + 3 users + 5 varied tasks |
| 02:45 | Updated `package.json` with `start` and `dev` scripts |

### Phase 2: Backend Configuration

| Time | Action |
|---|---|
| 02:45 | Copied `.env.example` → `.env` |
| 02:50 | Auto-generated JWT_SECRET via PowerShell Base64 random bytes → written to `.env` |
| 02:52 | User provided MongoDB Atlas URI: `mongodb+srv://acexuzair_db_user@cluster0.dr6yd7n.mongodb.net` |
| 02:53 | User needed DB password reset (Atlas Database Access → Edit User → new password) |
| 02:57 | User provided password `BLgtg1AsyxVzJa9S` → injected into MONGO_URI in `.env` |
| 02:57 | Ran `node seed.js` → ✅ Connected, seeded 4 users + 5 tasks |
| 02:57 | Ran `npm start` → ✅ Server running on port 5000 |

### Phase 3: Security Audit (/secure)
- ✅ JWT_SECRET only read from `process.env.JWT_SECRET` — never hardcoded
- ✅ No password in any response (schema + explicit select)
- ✅ All `/api/tasks` routes behind `router.use(auth)`
- ✅ PUT on non-owned task → 403 enforced in `updateTask` controller
- ✅ User status: can only move to `in-progress` or `completed`

### Phase 4: GitHub

| Time | Action |
|---|---|
| 02:59 | Created `.gitignore` (excludes `.env`, `node_modules`) |
| 02:59 | `git init` + `git remote add origin https://github.com/Butcherboy7/assignment.git` |
| 02:59 | Committed all backend files (19 files, 2046 insertions) |
| 02:59 | Pushed to `origin/main` — ✅ success |

### Phase 5: Mobile App

| Time | Action |
|---|---|
| 03:10 | Fetched all 6 screen designs from Google Stitch (project `194365617718097546`) |
| 03:13 | `npx create-expo-app@latest mobile --template blank` |
| 03:17 | Installed: @react-navigation/native, bottom-tabs, native-stack, screens, safe-area-context, async-storage, axios, picker, expo-linear-gradient |
| 03:17 | Created full `src/` folder structure |
| 03:18 | Wrote `src/theme.js` — design tokens from Stitch dark indigo theme |
| 03:18 | Wrote `src/services/api.js` — Axios instance, interceptors, logout callback |
| 03:18 | Wrote `src/context/AuthContext.js` — AsyncStorage persistence, login/logout |
| 03:18 | Wrote `src/navigation/AppNavigator.js` — role-gated tabs + stack |
| 03:19 | Wrote components: LoadingScreen, EmptyState, AppHeader, StatusBadge, PriorityBadge, TaskCard |
| 03:20 | Wrote screens: LoginScreen, TaskListScreen, TaskDetailScreen, CreateTaskScreen, ManageUsersScreen, ProfileScreen |
| 03:21 | Wrote `App.js` — SafeAreaProvider > AuthProvider > AppNavigator |

### Phase 6: UX Audit (/ux)

**TaskCard:**
- ✅ Colored left border communicates status at a glance
- ✅ Title truncates cleanly, PriorityBadge doesn't crowd it
- ✅ 2-line description truncation, meta row well-spaced
- ⚠️ Consider adding a visual chevron to indicate tappability

**TaskListScreen filter + search:**
- ✅ Pill filter bar is horizontally scrollable
- ✅ Search filters live without debounce (fine for small task lists)
- ⚠️ For large datasets (100+ tasks), add 300ms debounce to search
- ⚠️ Active filter + search combined shows no visual feedback for 0 results from filter

**TaskDetailScreen status update flow:**
- ✅ Action bar is fixed at bottom — always accessible
- ✅ Button labels are clear ("Mark In Progress" / "Mark Complete")
- ✅ Loading state on buttons prevents double-tap
- ⚠️ After status update, no toast/snackbar — only silent UI change. Consider adding feedback.

---

## Files Created This Session

### Backend (`/backend`)
`server.js`, `.env.example`, `models/User.js`, `models/Task.js`, `middleware/auth.js`, `middleware/role.js`, `middleware/validate.js`, `routes/auth.js`, `routes/tasks.js`, `routes/users.js`, `controllers/authController.js`, `controllers/taskController.js`, `controllers/userController.js`, `seed.js`

### Mobile (`/mobile`)
`App.js`, `.env`, `src/theme.js`, `src/context/AuthContext.js`, `src/services/api.js`, `src/navigation/AppNavigator.js`, `src/components/LoadingScreen.js`, `src/components/EmptyState.js`, `src/components/AppHeader.js`, `src/components/StatusBadge.js`, `src/components/PriorityBadge.js`, `src/components/TaskCard.js`, `src/screens/LoginScreen.js`, `src/screens/TaskListScreen.js`, `src/screens/TaskDetailScreen.js`, `src/screens/CreateTaskScreen.js`, `src/screens/ManageUsersScreen.js`, `src/screens/ProfileScreen.js`

### Root
`.gitignore`, `handoff.md`, `decisions.md`, `logs.md`
