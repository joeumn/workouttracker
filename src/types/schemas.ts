import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

// Meal schemas
export const MealSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  calories: z.number().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  date: z.date(),
  createdAt: z.date(),
});

export const CreateMealSchema = z.object({
  name: z.string().min(1),
  calories: z.number().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  date: z.string().datetime().optional(),
});

// Workout schemas
export const WorkoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  date: z.date(),
  notes: z.string().optional(),
  createdAt: z.date(),
});

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// Set schemas
export const SetSchema = z.object({
  id: z.string(),
  workoutId: z.string(),
  exercise: z.string(),
  weight: z.number().nonnegative(),
  reps: z.number().positive(),
  order: z.number().nonnegative(),
  createdAt: z.date(),
});

export const CreateSetSchema = z.object({
  exercise: z.string().min(1),
  weight: z.number().nonnegative(),
  reps: z.number().positive(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Meal = z.infer<typeof MealSchema>;
export type CreateMeal = z.infer<typeof CreateMealSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
export type CreateWorkout = z.infer<typeof CreateWorkoutSchema>;
export type Set = z.infer<typeof SetSchema>;
export type CreateSet = z.infer<typeof CreateSetSchema>;