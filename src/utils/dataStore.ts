import { User, Meal, Workout, Set } from '../types/schemas';

// In-memory data store (in a real app, this would be a database)
export class DataStore {
  private users: Map<string, User> = new Map();
  private meals: Map<string, Meal> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private sets: Map<string, Set> = new Map();

  // User methods
  createUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  // Meal methods
  createMeal(meal: Meal): void {
    this.meals.set(meal.id, meal);
  }

  getMealsByUserId(userId: string): Meal[] {
    return Array.from(this.meals.values()).filter(meal => meal.userId === userId);
  }

  // Workout methods
  createWorkout(workout: Workout): void {
    this.workouts.set(workout.id, workout);
  }

  getWorkoutsByUserId(userId: string): Workout[] {
    return Array.from(this.workouts.values()).filter(workout => workout.userId === userId);
  }

  getWorkoutById(id: string): Workout | undefined {
    return this.workouts.get(id);
  }

  // Set methods
  createSet(set: Set): void {
    this.sets.set(set.id, set);
  }

  getSetsByWorkoutId(workoutId: string): Set[] {
    return Array.from(this.sets.values())
      .filter(set => set.workoutId === workoutId)
      .sort((a, b) => a.order - b.order);
  }
}

export const dataStore = new DataStore();