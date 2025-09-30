# Workout Tracker API

A REST API for tracking workouts and meals built with Express, TypeScript, and Zod validation.

## Features

- **Authentication**: JWT-based authentication
- **Data Validation**: Zod schemas for all inputs
- **Core APIs**: User profile, meals, workouts, and exercise sets
- **Type Safety**: Full TypeScript support
- **Testing**: Comprehensive test suite with Jest

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2025-09-30T01:00:00.000Z",
    "updatedAt": "2025-09-30T01:00:00.000Z"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Profile

#### GET /api/me
Get current user profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2025-09-30T01:00:00.000Z",
  "updatedAt": "2025-09-30T01:00:00.000Z"
}
```

### Meals

#### GET /api/meals
Get user's meals. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "meal-id",
    "userId": "user-id",
    "name": "Grilled Chicken",
    "calories": 300,
    "protein": 50,
    "carbs": 5,
    "fat": 8,
    "date": "2025-09-30T01:00:00.000Z",
    "createdAt": "2025-09-30T01:00:00.000Z"
  }
]
```

#### POST /api/meals
Create a new meal. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "name": "Grilled Chicken",
  "calories": 300,
  "protein": 50,
  "carbs": 5,
  "fat": 8,
  "date": "2025-09-30T01:00:00.000Z" // optional
}
```

### Workouts

#### GET /api/workouts
Get user's workouts. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "workout-id",
    "userId": "user-id",
    "name": "Push Day",
    "date": "2025-09-30T01:00:00.000Z",
    "notes": "Chest, shoulders, triceps",
    "createdAt": "2025-09-30T01:00:00.000Z"
  }
]
```

#### POST /api/workouts
Create a new workout. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "name": "Push Day",
  "date": "2025-09-30T01:00:00.000Z", // optional
  "notes": "Chest, shoulders, triceps" // optional
}
```

### Exercise Sets

#### POST /api/workouts/:id/sets
Add exercise sets to a workout. Requires authentication and workout ownership.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "exercise": "Bench Press",
  "weight": 80,
  "reps": 10
}
```

**Response:**
```json
{
  "id": "set-id",
  "workoutId": "workout-id",
  "exercise": "Bench Press",
  "weight": 80,
  "reps": 10,
  "order": 0,
  "createdAt": "2025-09-30T01:00:00.000Z"
}
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
npm run test:watch
```

## Building

```bash
npm run build
npm start
```

## Environment Variables

- `JWT_SECRET`: Secret key for JWT tokens (defaults to 'your-secret-key')
- `PORT`: Server port (defaults to 3000)

## Validation Rules

All endpoints use Zod validation with the following rules:

### User Registration
- Email: Valid email format
- Password: Minimum 6 characters
- Name: Non-empty string

### Meals
- Name: Non-empty string
- Calories: Positive number
- Protein, Carbs, Fat: Non-negative numbers
- Date: Optional ISO 8601 datetime

### Workouts
- Name: Non-empty string
- Date: Optional ISO 8601 datetime
- Notes: Optional string

### Exercise Sets
- Exercise: Non-empty string
- Weight: Non-negative number
- Reps: Positive number

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message"
}
```

For validation errors:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["field"],
      "message": "Validation message"
    }
  ]
}
```
