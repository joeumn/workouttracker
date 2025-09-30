import { User, League, Challenge, Meal, Post, BuddyMatch, WorkoutEntry, ScoreEntry } from '../models/types';

export class DataService {
  private users: Map<string, User> = new Map();
  private leagues: Map<string, League> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private meals: Map<string, Meal> = new Map();
  private posts: Map<string, Post> = new Map();
  private buddyMatches: Map<string, BuddyMatch> = new Map();
  private workouts: Map<string, WorkoutEntry> = new Map();
  private scores: Map<string, ScoreEntry> = new Map();

  // User methods
  createUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUserScore(userId: string, totalScore: number, weeklyScore: number): void {
    const user = this.users.get(userId);
    if (user) {
      user.totalScore = totalScore;
      user.weeklyScore = weeklyScore;
      this.users.set(userId, user);
    }
  }

  // League methods
  createLeague(league: League): void {
    this.leagues.set(league.id, league);
  }

  getLeague(id: string): League | undefined {
    return this.leagues.get(id);
  }

  getAllLeagues(): League[] {
    return Array.from(this.leagues.values());
  }

  // Challenge methods
  createChallenge(challenge: Challenge): void {
    this.challenges.set(challenge.id, challenge);
  }

  getChallenge(id: string): Challenge | undefined {
    return this.challenges.get(id);
  }

  getAllChallenges(): Challenge[] {
    return Array.from(this.challenges.values());
  }

  // Meal methods
  createMeal(meal: Meal): void {
    this.meals.set(meal.id, meal);
  }

  getMeal(id: string): Meal | undefined {
    return this.meals.get(id);
  }

  getMealsByUser(userId: string): Meal[] {
    return Array.from(this.meals.values()).filter(meal => meal.userId === userId);
  }

  getMealsByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Meal[] {
    return Array.from(this.meals.values()).filter(meal => 
      meal.userId === userId && 
      meal.date >= startDate && 
      meal.date <= endDate
    );
  }

  // Post methods
  createPost(post: Post): void {
    this.posts.set(post.id, post);
  }

  getPost(id: string): Post | undefined {
    return this.posts.get(id);
  }

  getAllPosts(): Post[] {
    return Array.from(this.posts.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Buddy match methods
  createBuddyMatch(match: BuddyMatch): void {
    this.buddyMatches.set(match.id, match);
  }

  getBuddyMatch(id: string): BuddyMatch | undefined {
    return this.buddyMatches.get(id);
  }

  getAllBuddyMatches(): BuddyMatch[] {
    return Array.from(this.buddyMatches.values());
  }

  getBuddyMatchesForUser(userId: string): BuddyMatch[] {
    return Array.from(this.buddyMatches.values()).filter(match => 
      (match.user1Id === userId || match.user2Id === userId) && match.isActive
    );
  }

  // Workout methods
  createWorkout(workout: WorkoutEntry): void {
    this.workouts.set(workout.id, workout);
  }

  getWorkout(id: string): WorkoutEntry | undefined {
    return this.workouts.get(id);
  }

  getWorkoutsByUser(userId: string): WorkoutEntry[] {
    return Array.from(this.workouts.values()).filter(workout => workout.userId === userId);
  }

  getWorkoutsByUserAndDateRange(userId: string, startDate: Date, endDate: Date): WorkoutEntry[] {
    return Array.from(this.workouts.values()).filter(workout => 
      workout.userId === userId && 
      workout.date >= startDate && 
      workout.date <= endDate
    );
  }

  // Score methods
  createScore(score: ScoreEntry): void {
    this.scores.set(score.id, score);
  }

  getScore(id: string): ScoreEntry | undefined {
    return this.scores.get(id);
  }

  getScoresByChallenge(challengeId: string): ScoreEntry[] {
    return Array.from(this.scores.values()).filter(score => score.challengeId === challengeId);
  }

  getScoresByUser(userId: string): ScoreEntry[] {
    return Array.from(this.scores.values()).filter(score => score.userId === userId);
  }

  // Clear all data (useful for testing)
  clearAll(): void {
    this.users.clear();
    this.leagues.clear();
    this.challenges.clear();
    this.meals.clear();
    this.posts.clear();
    this.buddyMatches.clear();
    this.workouts.clear();
    this.scores.clear();
  }
}