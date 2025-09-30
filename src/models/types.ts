export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  totalScore: number;
  weeklyScore: number;
}

export interface League {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: string[]; // user IDs
  isActive: boolean;
}

export interface Challenge {
  id: string;
  leagueId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  weeklyGoals: WeeklyGoal[];
  participants: string[]; // user IDs
}

export interface WeeklyGoal {
  week: number;
  workoutTarget: number;
  calorieTarget: number;
  macroTargets: MacroTargets;
}

export interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface Meal {
  id: string;
  userId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  macros: MacroTargets;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  type: 'workout' | 'meal' | 'progress' | 'general';
  timestamp: Date;
  likes: string[]; // user IDs who liked
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface BuddyMatch {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: Date;
  isActive: boolean;
  compatibilityScore: number;
}

export interface WorkoutEntry {
  id: string;
  userId: string;
  date: Date;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  notes?: string;
}

export interface ScoreEntry {
  id: string;
  userId: string;
  challengeId: string;
  week: number;
  workoutScore: number;
  nutritionScore: number;
  totalScore: number;
  calculatedAt: Date;
}