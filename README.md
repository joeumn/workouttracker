# Workout Tracker - Gym Buddy Matching System

A Flask-based API for matching gym buddies based on compatibility scores, preferences, and mutual connections.

## Features

- **User Profiles**: Create users with gender, age, and workout preferences
- **Buddy Preferences**: Set gender preferences (including "no preference"), age ranges, workout types, availability, fitness levels, and goals
- **Compatibility Scoring**: Advanced algorithm that calculates compatibility based on multiple factors
- **Discovery System**: Find potential gym buddies with compatibility scores
- **Like/Match System**: Send likes and establish mutual connections
- **Block/Report**: Block inappropriate users and maintain safety
- **Gender Preferences**: Respect all gender preferences including "no preference" option

## API Endpoints

### Health Check
- `GET /` - API health check and endpoint overview

### User Management
- `POST /api/users` - Create a new user
- `GET /api/users/<user_id>` - Get user information

### Preferences
- `GET /api/preferences?user_id=<id>` - Get user's buddy preferences
- `POST /api/preferences` - Update buddy preferences

### Buddy Matching
- `GET /api/discover?user_id=<id>&limit=<num>` - Find potential gym buddies
- `POST /api/like` - Send a like to another user
- `GET /api/connections?user_id=<id>&status=<status>` - Get connections
- `POST /api/block` - Block/report a user

## Installation and Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Initialize the database:
```bash
python app.py
```

4. Run tests:
```bash
pytest test_buddy_matching.py -v
```

## Usage Examples

### Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com", 
    "gender": "male",
    "age": 25
  }'
```

### Set Buddy Preferences
```bash
curl -X POST http://localhost:5000/api/preferences \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "gender_preference": "no_preference",
    "min_age": 20,
    "max_age": 35,
    "workout_types": ["weightlifting", "cardio"],
    "availability_days": ["monday", "wednesday", "friday"],
    "fitness_level": "intermediate",
    "goals": ["muscle_gain", "strength"],
    "gym_location": "Downtown Gym"
  }'
```

### Discover Gym Buddies
```bash
curl "http://localhost:5000/api/discover?user_id=1&limit=10"
```

### Send a Like
```bash
curl -X POST http://localhost:5000/api/like \
  -H "Content-Type: application/json" \
  -d '{
    "from_user_id": 1,
    "to_user_id": 2
  }'
```

## Compatibility Scoring

The system calculates compatibility based on:

- **Gender Preferences** (30% weight): Mutual gender preference compatibility
- **Age Compatibility** (20% weight): Whether users fall within each other's age ranges
- **Workout Types** (25% weight): Overlap in preferred workout activities
- **Availability** (15% weight): Common available days for working out
- **Fitness Level** (10% weight): Similarity in fitness experience levels

## Database Schema

### User
- id, username, email, gender, age, created_at

### BuddyPreference  
- user_id, gender_preference, min_age, max_age, workout_types, availability_days, fitness_level, goals, gym_location

### BuddyConnection
- from_user_id, to_user_id, status (pending/mutual/blocked), created_at, updated_at

### BlockedUser
- blocker_id, blocked_id, reason, created_at

## Development

Run the development server:
```bash
python app.py
```

Run tests:
```bash
pytest test_buddy_matching.py -v
```

## License

MIT License
