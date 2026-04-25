# TaskFlow

🎥 **[Watch the App Demo Video Here](https://drive.google.com/file/d/1-WlHs-Uo9RHi-rnmW9PlKgI0P3xAKfRY/view?usp=drivesdk)**

## Overview
TaskFlow is a robust, role-based task management system designed to streamline team collaboration. It provides a seamless experience for administrators to orchestrate tasks and for users to track their assignments.

## Tech Stack
Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, express-rate-limit
Mobile: Expo, React Navigation, Axios, AsyncStorage, react-native-toast-message

## Getting Started (Spoon-Fed Guide)

### Prerequisites
- You need **Node.js 18+** installed on your computer.
- You need the **Expo Go** app installed on your smartphone (available on iOS App Store and Google Play Store).

### 🔍 Engineering Documentation
**For the Reviewer:** I strongly believe in disciplined project maintenance and technical scoping. Please take a look at my included **`logs.md`** and **`decisions.md`** files in the root directory to review the chronological progress and architectural choices made throughout this project's lifecycle!

### Step 1: Clone the Repository
Open a terminal and run the following command to download the code:
```bash
git clone https://github.com/Butcherboy7/assignment.git
cd assignment
```

### Step 2: Start the Backend (API)
Follow these exact steps to start the server:

1. Open a new Terminal (or Command Prompt).
2. Type `cd backend` and press Enter.
3. Type `npm install` and press Enter.
4. Type `node seed.js` and press Enter (this creates test users for you).
5. Type `npm run dev` and press Enter. 

You should see this message:
✅ `Server running on port 5000`
✅ `MongoDB Connected` *(If you see an IP Whitelist error here, see the Troubleshooting section below!)*

Leave this terminal window **OPEN** and running.

### Step 2: Start the Mobile App
Now, let's start the app!

1. Open a **brand new** Terminal (keep the backend one running!).
2. Type `cd mobile` and press Enter.
3. Type `npm install` and press Enter.
4. Open the file `mobile/.env` in your code editor. 
   - **Important**: Change `YOUR_LOCAL_IP` to your actual computer's Wi-Fi IP address. 
   - *How to find it on Windows*: Open Command Prompt, type `ipconfig`, press Enter, and look for "IPv4 Address" (e.g., `192.168.1.5`).
   - Your `.env` file should look exactly like this: `EXPO_PUBLIC_API_URL=http://192.168.1.5:5000`
5. Type `npx expo start` and press Enter.

A giant QR code will appear in your terminal. 
- **iPhone**: Open your normal Camera app, point it at the QR code, and tap the yellow Expo link.
- **Android**: Open the Expo Go app and tap "Scan QR Code".

### Step 3: Log In and Test!
Use these ready-to-go test accounts to log in from your phone:

| Login Email | Password | What You Can Do (Role) |
|---|---|---|
| `admin@test.com` | `admin123` | **Admin:** Can create tasks, edit everything, and delete! |
| `user1@test.com` | `user123` | **User:** Can only see tasks assigned to them and mark them complete. |
| `user2@test.com` | `user123` | **User** |
| `user3@test.com` | `user123` | **User** |


## Troubleshooting ⚠️
**MongoDB IP Whitelist Error:** If the backend terminal says `Could not connect to any servers in your MongoDB Atlas cluster`, your database requires your current Wi-Fi network's IP address to be allowed.
**The Instant Fix:**
1. Log into your MongoDB Atlas dashboard.
2. Go to **Network Access** (under Security on the left menu).
3. Click **Add IP Address**.
4. Instead of clicking "Add Current IP", manually type exactly `0.0.0.0/0` into the Access List Entry box.
5. Click **Confirm** and wait 2 minutes for it to say "Active".
6. Restart the backend terminal and it will connect instantly!

## Features
### Admin
- [x] Can view all tasks with assignee names
- [x] Can create and assign new tasks to specific users
- [x] Can edit an existing task's title, description, and status
- [x] Can delete a task with a confirmation alert
- [x] Can view all registered users under the 'Users' tab
- [x] Experiences 4 exclusive tabs for comprehensive management

### User
- [x] Can only see tasks actively assigned to them
- [x] Can update their task status to "in-progress" or "completed"
- [x] Cannot modify any task attribute outside of status
- [x] Experiences 2 streamlined tabs for focused work
- [x] Cannot view tasks belonging to other users

## Project Structure
```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── seed.js
│   └── server.js
└── mobile/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── navigation/
    │   ├── screens/
    │   ├── services/
    │   └── theme.js
    ├── .env
    ├── app.json
    └── App.js
```

## Security Notes
- Passwords hashed with bcrypt (10 rounds)
- JWT authentication, 7 day expiry
- Role enforcement in middleware layer
- Input whitelisting on all update operations
- Rate limiting on login endpoint (10 attempts per 15 minutes)
- CORS open for development — restrict origins in production

## Known Limitations
- Web platform not supported (React Native mobile only)
- No push notifications
- Token stored in AsyncStorage (standard for React Native, not applicable to web)
