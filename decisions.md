# DECISIONS.md

## Architecture Decisions

### 1. MongoDB Atlas over Local DB
- **Decision**: Used cloud-hosted MongoDB Atlas.
- **Rationale**: Easier for collaboration and deployment. Prevents "works on my machine" issues with local MongoDB installations.

### 2. Forbidden Backward Status Transitions
- **Decision**: Restricted users from moving tasks back to "pending".
- **Rationale**: Business logic prevents users from resetting progress once started, enforcing a linear workflow (Pending -> In-Progress -> Completed).

### 3. Password Security
- **Decision**: Implemented `select: false` on the User model.
- **Rationale**: Ensures that even generic `User.find()` calls do not accidentally include hashed passwords in JSON responses.

### 4. Centrally Managed Validation
- **Decision**: Used `express-validator` with centralized `handleValidation` middleware.
- **Rationale**: Consistent error response format across the entire API (400 Bad Request with clear messaging).

### 5. JWT Expiry
- **Decision**: Set to 7 days.
- **Rationale**: Balance between security and user experience for a task management tool.
