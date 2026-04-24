# TaskFlow — Role-Based Task Manager

A stunning, fully-animated task management application with **role-based access control (RBAC)**.  
Backend: Node.js + Express + MongoDB Atlas  
Frontend: React Native (Expo SDK 54) + Web Support

---

## 🔥 Run the Live Web Demo (Easiest Way!)

You don't need a phone or APK to test the app! Expo supports running the mobile app directly in your browser.

**1. Start the Backend** (keep this terminal open)
```bash
cd backend
npm install
node seed.js  # skip if already seeded
npm run dev
```

**2. Start the Frontend (Web Mode)**
Open a **new** terminal:
```bash
cd mobile
npm install

# Run the web version!
npx expo start --web
```
*Your browser will automatically open to `http://localhost:8081` showing the fully-functional mobile app adapted for web!*

---

## 📱 Running on iOS or Android (Via Expo Go)

If you prefer testing on your physical phone, follow these exact steps:

**1. Set your backend IP**
Your phone needs to connect to your PC. Open `mobile/.env` and ensure it uses your exact PC network IP (e.g., `192.168.0.104`):
```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```
> *To find your IP on Windows:* open Command Prompt, type `ipconfig`, look for `IPv4 Address`.

**2. Start the Tunnel**
Instead of a standard start, we will use a **tunnel** to bypass firewall/LAN issues.
```bash
cd mobile
npx expo start --tunnel
```

**3. Test on Phone**
- Download **Expo Go** from the iOS App Store or Google Play.
- **Android:** Scan the QR code in the terminal using your camera.
- **iOS:** In the terminal, look for the `exp://` link. Open the Expo Go app, tap "Enter URL manually," and paste that link in!

---

## 🔑 Test Credentials (ready to use)

The database is pre-seeded with these users. Try both to see the different dashboards!

| Email | Password | What they see |
|---|---|---|
| `admin@test.com` | `admin123` | **Admin Dashboard:** 4 tabs. Can see everyone's tasks, create new tasks, reassign, and manage team members. |
| `user1@test.com` | `user123` | **User Dashboard:** 2 tabs. Only sees tasks assigned specifically to them. Can only change task status. |
| `user2@test.com` | `user123` | *Same as user1* |

---

## ✨ Features & UI Upgrades (v2)

- **Complete Re-design:** Deep dark mode with violet/cyan glows, glassmorphic inputs, and premium typography.
- **Animations:** 
  - Staggered slide-in & fade list animations.
  - Scale & spring animations on interactions.
  - Custom pulsing/spinning loading screens.
- **Responsive:** Adapts beautifully to Web, iOS, and Android.
- **Full RBAC:** Secure backend routes + conditional frontend rendering based on `admin` vs `user` roles.
- **Robust Auth:** JWT tokens stored securely, auto-rehydration on refresh, instant feedback on wrong passwords.

---

## 🏗️ Building the Android APK (Production)

To create a standalone `.apk` you can install without Expo Go:

```bash
cd mobile
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
*Wait ~10 minutes. Click the resulting Expo URL to download the APK straight to your phone.*

---

## 💻 API Endpoints (Backend)

Base URL: `http://localhost:5000/api`

| Method | Route              | Auth | Role  |
|--------|--------------------|------|-------|
| POST   | `/auth/login`      | ❌   | Any   |
| GET    | `/tasks`           | 🔒   | Any (Admin=All, User=Own tasks) |
| POST   | `/tasks`           | 🔒   | Admin only |
| PUT    | `/tasks/:id`       | 🔒   | Any (User restricted to status-only on own tasks) |
| DELETE | `/tasks/:id`       | 🔒   | Admin only |
| GET    | `/users`           | 🔒   | Admin only |

> *Run `.\test_api.ps1` in the `backend/` folder to run an automated suite of 16 security and API tests.*

