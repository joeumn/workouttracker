# Workout Tracker - Groups & Leaderboard API

A Node.js/Express API for workout tracking with groups and leaderboard functionality.

## Features

- Create and manage workout groups
- Invite users to groups
- Create challenges within groups
- View leaderboards with different metrics and time windows
- Weekly ISO logic with tie-breakers

## API Endpoints

### Groups

#### GET /api/groups
Get all groups

**Response:**
```json
[
  {
    "_id": "groupId",
    "name": "Fitness Enthusiasts",
    "description": "A group for fitness lovers",
    "owner": {
      "_id": "userId",
      "username": "john_doe"
    },
    "members": [
      {
        "user": {
          "_id": "userId",
          "username": "john_doe"
        },
        "joinedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/groups
Create a new group

**Request:**
```json
{
  "name": "My Fitness Group",
  "description": "A group for tracking workouts together",
  "ownerId": "userId"
}
```

**Response:**
```json
{
  "_id": "groupId",
  "name": "My Fitness Group",
  "description": "A group for tracking workouts together",
  "owner": {
    "_id": "userId",
    "username": "john_doe"
  },
  "members": [
    {
      "user": {
        "_id": "userId",
        "username": "john_doe"
      },
      "joinedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "inviteCode": "abc123def456",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Group Invitations

#### POST /api/groups/:id/invite
Join a group using invite code or group ID

**Request:**
```json
{
  "userId": "userId",
  "inviteCode": "abc123def456"
}
```

**Response:**
```json
{
  "_id": "groupId",
  "name": "My Fitness Group",
  "members": [
    {
      "user": {
        "_id": "ownerId",
        "username": "john_doe"
      },
      "joinedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "user": {
        "_id": "userId",
        "username": "jane_doe"
      },
      "joinedAt": "2023-01-02T00:00:00.000Z"
    }
  ]
}
```

### Challenges

#### GET /api/groups/:id/challenges
Get all challenges for a group

**Response:**
```json
[
  {
    "_id": "challengeId",
    "title": "Weekly Protein Goal",
    "description": "Hit 700g of protein this week",
    "metric": "protein",
    "target": 700,
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-07T23:59:59.999Z",
    "status": "active",
    "creator": {
      "_id": "userId",
      "username": "john_doe"
    },
    "participants": [
      {
        "user": {
          "_id": "userId",
          "username": "john_doe"
        },
        "joinedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

#### POST /api/groups/:id/challenges
Create a new challenge for a group

**Request:**
```json
{
  "title": "Weekly Protein Challenge",
  "description": "Let's see who can get the most protein this week!",
  "creatorId": "userId",
  "metric": "protein",
  "target": 700,
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2023-01-07T23:59:59.999Z"
}
```

### Leaderboard

#### GET /api/groups/:id/leaderboard?metric=protein&window=week
Get leaderboard for a group

**Query Parameters:**
- `metric`: `protein`, `calories`, or `workoutMinutes`
- `window`: `week`, `month`, or `all`

**Response:**
```json
{
  "group": {
    "_id": "groupId",
    "name": "My Fitness Group"
  },
  "metric": "protein",
  "window": "week",
  "period": {
    "startDate": "2023-01-02T00:00:00.000Z",
    "endDate": "2023-01-08T23:59:59.999Z"
  },
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "_id": "userId1",
        "username": "john_doe"
      },
      "total": 650,
      "entries": 7,
      "average": 92.86,
      "lastActivity": 1672617600000
    },
    {
      "rank": 2,
      "user": {
        "_id": "userId2",
        "username": "jane_doe"
      },
      "total": 580,
      "entries": 6,
      "average": 96.67,
      "lastActivity": 1672531200000
    }
  ]
}
```

## Leaderboard Features

### Weekly ISO Logic
- Weeks start on Monday and end on Sunday
- Uses ISO 8601 week date system
- Properly handles year boundaries

### Tie-Breaking Rules
When users have the same total for a metric, ties are broken in this order:
1. **Total value** (higher wins)
2. **Number of entries** (more entries wins)
3. **Average per entry** (higher average wins)
4. **Last activity timestamp** (more recent activity wins)

## Supported Metrics
- `protein`: Total protein intake in grams
- `calories`: Total calorie intake
- `workoutMinutes`: Total workout time in minutes

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/workouttracker
NODE_ENV=development
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## Testing

```bash
npm test
```

## API Health Check

```bash
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Workout Tracker API is running"
}
```