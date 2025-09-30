# Workout Tracker

A Node.js/Express application for tracking workouts with groups and leaderboard functionality.

## Features

- **Groups Management**: Create and join workout groups
- **Group Invitations**: Invite users with unique invite codes
- **Challenges**: Create group challenges with specific metrics and targets
- **Leaderboards**: View rankings with weekly ISO logic and tie-breakers
- **Multiple Metrics**: Track protein, calories, and workout minutes

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see `.env` file)

3. Start the server:
   ```bash
   npm start
   ```

4. API will be available at `http://localhost:3000`

## API Endpoints

- `GET|POST /api/groups` - List/create groups
- `POST /api/groups/:id/invite` - Join groups with invite codes
- `GET|POST /api/groups/:id/challenges` - List/create challenges
- `GET /api/groups/:id/leaderboard?metric=protein&window=week` - View leaderboards

## Documentation

See [API.md](API.md) for detailed API documentation with examples.

## Testing

```bash
npm test
```
