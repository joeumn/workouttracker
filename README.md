# Workout Tracker - Social Feed API

A Flask-based social workout tracking application with comprehensive social features including posts, reactions, comments, and follows.

## Features

- ✅ **SocialPost** - Support for PR/Streak/Check-in posts with workout data
- ✅ **Reaction** - Inline reactions (like, love, fire, strong) with user attribution
- ✅ **Comment** - Full commenting system on posts
- ✅ **Follow** - User following/followers functionality  
- ✅ **Feed** - Personalized feeds showing own posts + followed users' posts
- ✅ **Inline Reactions** - Reactions are grouped by type with user lists

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Create a new user |
| `GET` | `/users` | List all users |
| `GET` | `/users/{id}` | Get user by ID |
| `GET` | `/users/{id}/followers` | Get user's followers |
| `GET` | `/users/{id}/following` | Get users followed by user |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/posts` | Create a new social post |
| `GET` | `/posts` | List all posts (chronological) |
| `GET` | `/posts/{id}` | Get post by ID with reactions/comments |
| `GET` | `/feed/{user_id}` | Get personalized feed for user |

### Reactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/posts/{id}/reactions` | Add/update reaction to post |
| `DELETE` | `/posts/{id}/reactions/{user_id}` | Remove reaction from post |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/posts/{id}/comments` | Add comment to post |
| `GET` | `/posts/{id}/comments` | Get comments for post |

### Following

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users/{id}/follow` | Follow a user |
| `DELETE` | `/users/{id}/follow` | Unfollow a user |

## Data Models

### User
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "created_at": "2024-01-01T00:00:00",
  "followers_count": 5,
  "following_count": 3
}
```

### SocialPost
```json
{
  "id": 1,
  "user_id": 1,
  "author": { "username": "alice", ... },
  "post_type": "pr",
  "title": "New deadlift PR! 💪",
  "content": "Just hit 315lbs for the first time!",
  "workout_data": {
    "exercise": "deadlift",
    "weight": 315,
    "reps": 1,
    "unit": "lbs"
  },
  "created_at": "2024-01-01T00:00:00",
  "reactions": {
    "fire": {
      "count": 2,
      "users": ["bob", "charlie"]
    },
    "strong": {
      "count": 1,
      "users": ["dave"]
    }
  },
  "comments": [
    {
      "id": 1,
      "author": { "username": "bob", ... },
      "content": "Amazing work!",
      "created_at": "2024-01-01T00:01:00"
    }
  ],
  "comments_count": 1,
  "reactions_count": 3
}
```

## Post Types

- `pr` - Personal Record
- `streak` - Workout streak milestone
- `checkin` - Daily workout check-in

## Reaction Types

- `like` - 👍 Like
- `love` - ❤️ Love  
- `fire` - 🔥 Fire
- `strong` - 💪 Strong

## Usage Examples

### Create a User
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com"}'
```

### Create a PR Post
```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "post_type": "pr",
    "title": "New deadlift PR! 💪",
    "content": "Just hit 315lbs for the first time!",
    "workout_data": {
      "exercise": "deadlift",
      "weight": 315,
      "reps": 1,
      "unit": "lbs"
    }
  }'
```

### Add a Reaction
```bash
curl -X POST http://localhost:5000/posts/1/reactions \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2, "reaction_type": "fire"}'
```

### Follow a User
```bash
curl -X POST http://localhost:5000/users/1/follow \
  -H "Content-Type: application/json" \
  -d '{"follower_id": 2}'
```

### Get User Feed
```bash
curl http://localhost:5000/feed/2
```

## Installation & Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Visit the web demo:
```
http://localhost:5000/demo
```

## Testing

Run the test suite:
```bash
python test_social_feed.py
```

Or use the interactive API test:
```bash
python test_api.py
```

## Features Implemented

- [x] **SocialPost** model with support for PRs, streaks, and check-ins
- [x] **Reaction** model with inline grouping by type
- [x] **Comment** model with full CRUD operations
- [x] **Follow** model with follower/following relationships
- [x] **Feed** endpoint showing personalized content (own + followed users)
- [x] **Inline reactions** with user attribution and counts
- [x] **Workout data** support in JSON format for exercise tracking
- [x] **Web demo** with beautiful UI showing all functionality
- [x] **Comprehensive test suite** covering all major features
- [x] **RESTful API** with proper HTTP status codes and error handling
