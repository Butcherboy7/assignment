# DECISIONS.md

## Architecture Decisions

### 1. MongoDB Atlas over Local DB
- **Decision**: Cloud-hosted MongoDB Atlas.
- **Rationale**: No local MongoDB install, works across devices, easy for collaboration.

### 2. Forbidden Backward Status Transitions
- **Decision**: Users cannot move tasks back to "pending".
- **Rationale**: Enforces linear workflow (Pending → In Progress → Completed), prevents abuse of the status system.

### 3. Password Security — Double Layer
- **Decision**: `select: false` on schema + explicit `.select("-password")` on queries.
- **Rationale**: Defense in depth — even if a developer forgets the explicit select, schema-level protection catches it.

### 4. Centralized Validation via express-validator
- **Decision**: `handleValidation` middleware with co-located validation arrays in controllers.
- **Rationale**: Keeps route files thin, validation lives close to the function it validates.

### 5. JWT Expiry — 7 Days
- **Decision**: 7-day JWT with no refresh token.
- **Rationale**: Balanced UX for short assignment; production would need refresh rotation.

### 6. API Logout Callback Pattern
- **Decision**: `api.setLogoutCallback(fn)` called by AppNavigator on mount.
- **Rationale**: Avoids circular imports between api.js (service layer) and AuthContext (React layer). Navigation-agnostic way to trigger logout on global 401.

### 7. useFocusEffect for Task List Refresh
- **Decision**: Task list re-fetches every time screen is focused.
- **Rationale**: Ensures data is fresh after returning from TaskDetail (status update) without a complex state sync.

### 8. Role-Based Navigation Structure
- **Decision**: Separate UserTabs (2 tabs) and AdminTabs (4 tabs) components.
- **Rationale**: Clean separation of role UX — no conditional tab hiding which would cause layout jank and is harder to maintain.

### 9. Stitch Design as Source of Truth
- **Decision**: Fetched all 6 screen designs from Google Stitch before coding.
- **Rationale**: Avoids design drift, ensures pixel-accurate implementation of the dark indigo theme.

### 10. Status Color on TaskCard Left Border
- **Decision**: 3px left border uses status color instead of priority color.
- **Rationale**: Status changes more frequently and is the primary information users need to scan — priority is shown via badge on the right.

### 11. Expo Web Support (react-native-web)
- **Decision**: Added `react-native-web` and `@expo/metro-runtime` to allow single-command web demos (`npx expo start --web`).
- **Rationale**: Enables potential clients or reviewers to test out the full application instantaneously in their browser without downloading Expo Go or dealing with local network/firewall configuration headaches.

### 12. Animated UI/UX Overhaul (V2)
- **Decision**: Replaced all stock components with animated, glassmorphic UI elements featuring staggered slide-ups, custom loading spinners, glowing absolute accents, and `Ionicons`.
- **Rationale**: Transforms the app from a "functional MVP" into a "premium product." Fluid interactions mask minor network delays and create a high-quality "WOW" factor immediately on login.

