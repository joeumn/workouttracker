# Prisma Schema Documentation

## Database Models Overview

### Core Models Implementation Status ✅

All required models from the specification have been implemented:

**User Management & Auth**
- ✅ User - Core user model with Auth.js integration
- ✅ Account - OAuth provider accounts (Auth.js)
- ✅ Session - User sessions (Auth.js)  
- ✅ VerificationToken - Email verification (Auth.js)

**Fitness Tracking**
- ✅ MealEntry - Nutrition tracking with calories and macros
- ✅ Workout - Workout sessions with metadata
- ✅ Set - Individual exercise sets within workouts

**Social Features**
- ✅ Group - Community groups for users
- ✅ Member - Group membership with roles (ADMIN, MODERATOR, MEMBER)
- ✅ Challenge - Fitness challenges with multiple types
- ✅ ScoreSnapshot - Progress tracking for challenges

**Gamification & Notifications**
- ✅ Achievement - User achievements with various types
- ✅ Notification - User notification system

## Relationships

### User Relationships
- User → MealEntry (1:N)
- User → Workout (1:N) 
- User → Member (1:N) - via group membership
- User → Challenge (1:N) - as creator
- User ↔ Challenge (M:N) - as participant
- User → ScoreSnapshot (1:N)
- User → Achievement (1:N)
- User → Notification (1:N)
- User → Account (1:N) - Auth.js
- User → Session (1:N) - Auth.js

### Workout Relationships  
- Workout → Set (1:N)
- Workout → User (N:1)

### Group Relationships
- Group → Member (1:N)
- Group → Challenge (1:N)

### Challenge Relationships
- Challenge → User (N:1) - creator
- Challenge → Group (N:1) - optional
- Challenge ↔ User (M:N) - participants
- Challenge → ScoreSnapshot (1:N)

## Enums Defined
- MemberRole: ADMIN, MODERATOR, MEMBER
- ChallengeType: WEIGHT_LOSS, WEIGHT_GAIN, TOTAL_WORKOUTS, TOTAL_WEIGHT_LIFTED, TOTAL_CALORIES_BURNED, TOTAL_DISTANCE, CUSTOM
- AchievementType: FIRST_WORKOUT, WORKOUT_STREAK, WEIGHT_MILESTONE, CALORIE_MILESTONE, DISTANCE_MILESTONE, CHALLENGE_WINNER, CUSTOM
- NotificationType: CHALLENGE_INVITE, CHALLENGE_START, CHALLENGE_END, ACHIEVEMENT_UNLOCKED, GROUP_INVITE, WORKOUT_REMINDER, GENERAL

## Indexes for Performance
- MealEntry: userId + date
- Workout: userId + date  
- Set: workoutId + order
- Challenge: isActive + startDate + endDate
- ScoreSnapshot: challengeId + timestamp, userId + challengeId + timestamp (unique)
- Achievement: userId + type
- Notification: userId + isRead + createdAt

## Migration Status
- ✅ Initial migration SQL generated
- ✅ Migration lock file created  
- ✅ Schema ready for database deployment

The schema is complete and ready for production use with a PostgreSQL database.