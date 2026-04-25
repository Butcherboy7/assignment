# TaskFlow

## Overview
TaskFlow is a robust, role-based task management system designed to streamline team collaboration. It provides a seamless experience for administrators to orchestrate tasks and for users to track their assignments.

## Tech Stack
Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, express-rate-limit
Mobile: Expo, React Navigation, Axios, AsyncStorage, react-native-toast-message

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Expo Go app on your phone OR Android/iOS emulator

### Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Run `npm install` to install the required dependencies.
3. Verify that the `.env` file exists and contains the `PORT`, `MONGO_URI`, and `JWT_SECRET`.
4. Run `npm start` (or `npm run dev`) to start the server at `http://localhost:5000`.

### Mobile Setup
1. Open a new terminal and navigate to the `mobile` folder.
2. Run `npm install` to install all Expo and React Native dependencies.
3. Open or create the `.env` file in the `mobile` directory. Set `EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000` (Use `ipconfig` or `ifconfig` to find your machine's local IPv4 address).
4. Run `npx expo start` to start the Expo bundler.
5. Scan the QR code using the Expo Go app on your phone to run the application.

### Seed Data
Run `node seed.js` from the /backend folder.
This creates:
| Email | Password | Role |
|---|---|---|
| `admin@test.com` | `admin123` | admin |
| `user1@test.com` | `user123` | user |
| `user2@test.com` | `user123` | user |
| `user3@test.com` | `user123` | user |

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
