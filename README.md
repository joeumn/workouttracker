# Workout Tracker

A comprehensive workout and nutrition tracking application with social features.

## Database Schema

This project uses Prisma with PostgreSQL. The schema includes:

### Core Models
- **User**: User profiles and authentication
- **MealEntry**: Nutrition tracking with calories, macros, and meal details
- **Workout**: Workout sessions with metadata
- **Set**: Individual exercise sets within workouts
- **Group**: Community groups for social features
- **Member**: Group membership with roles
- **Challenge**: Fitness challenges and competitions  
- **ScoreSnapshot**: Progress tracking for challenges
- **Achievement**: User achievements and milestones
- **Notification**: User notifications system

### Auth.js Integration
- **Account**: OAuth provider accounts
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your database connection in `.env`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/workouttracker"
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Run database migrations:
```bash
npm run db:migrate
```

## Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations in development
- `npm run db:reset` - Reset database and run all migrations
- `npm run db:studio` - Open Prisma Studio for database management
