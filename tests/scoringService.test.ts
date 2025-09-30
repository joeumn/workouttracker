import { describe, it, expect, beforeEach } from 'vitest';
import { ScoringService } from '../src/services/scoringService';
import { WorkoutEntry, Meal, WeeklyGoal, ScoreEntry } from '../src/models/types';

describe('ScoringService', () => {
  let scoringService: ScoringService;
  let mockWeeklyGoal: WeeklyGoal;

  beforeEach(() => {
    scoringService = new ScoringService();
    mockWeeklyGoal = {
      week: 1,
      workoutTarget: 4,
      calorieTarget: 2000,
      macroTargets: {
        protein: 150,
        carbs: 200,
        fat: 80,
        calories: 2000
      }
    };
  });

  describe('calculateWorkoutScore', () => {
    it('should return 0 for no workouts', () => {
      const workouts: WorkoutEntry[] = [];
      const score = scoringService.calculateWorkoutScore(workouts, mockWeeklyGoal);
      expect(score).toBe(0);
    });

    it('should return 100 for meeting or exceeding workout target', () => {
      const workouts: WorkoutEntry[] = [
        {
          id: '1', userId: 'user1', date: new Date(), type: 'Cardio',
          duration: 30, caloriesBurned: 300
        },
        {
          id: '2', userId: 'user1', date: new Date(), type: 'Strength',
          duration: 45, caloriesBurned: 200
        },
        {
          id: '3', userId: 'user1', date: new Date(), type: 'Yoga',
          duration: 60, caloriesBurned: 150
        },
        {
          id: '4', userId: 'user1', date: new Date(), type: 'HIIT',
          duration: 20, caloriesBurned: 250
        }
      ];
      
      const score = scoringService.calculateWorkoutScore(workouts, mockWeeklyGoal);
      expect(score).toBe(100);
    });

    it('should return 100 for exceeding workout target', () => {
      const workouts: WorkoutEntry[] = Array(5).fill(null).map((_, i) => ({
        id: i.toString(),
        userId: 'user1',
        date: new Date(),
        type: 'Workout',
        duration: 30,
        caloriesBurned: 200
      }));
      
      const score = scoringService.calculateWorkoutScore(workouts, mockWeeklyGoal);
      expect(score).toBe(100);
    });

    it('should return partial score for partial completion', () => {
      const workouts: WorkoutEntry[] = [
        {
          id: '1', userId: 'user1', date: new Date(), type: 'Cardio',
          duration: 30, caloriesBurned: 300
        },
        {
          id: '2', userId: 'user1', date: new Date(), type: 'Strength',
          duration: 45, caloriesBurned: 200
        }
      ];
      
      // 2 out of 4 workouts = 50%
      const score = scoringService.calculateWorkoutScore(workouts, mockWeeklyGoal);
      expect(score).toBe(50);
    });
  });

  describe('calculateNutritionScore', () => {
    it('should return 0 for no meals', () => {
      const meals: Meal[] = [];
      const score = scoringService.calculateNutritionScore(meals, mockWeeklyGoal);
      expect(score).toBe(0);
    });

    it('should calculate perfect score for meeting all macro targets', () => {
      const meals: Meal[] = Array(7).fill(null).map((_, day) => ({
        id: `meal_${day}`,
        userId: 'user1',
        date: new Date(),
        mealType: 'lunch' as const,
        name: 'Perfect Meal',
        calories: 2000, // Daily target
        macros: {
          protein: 150,
          carbs: 200,
          fat: 80,
          calories: 2000
        }
      }));

      const score = scoringService.calculateNutritionScore(meals, mockWeeklyGoal);
      expect(score).toBeCloseTo(100, 0);
    });

    it('should calculate partial score for partial macro achievement', () => {
      const meals: Meal[] = Array(7).fill(null).map((_, day) => ({
        id: `meal_${day}`,
        userId: 'user1',
        date: new Date(),
        mealType: 'lunch' as const,
        name: 'Half Meal',
        calories: 1000, // Half the daily target
        macros: {
          protein: 75,   // Half of target
          carbs: 100,    // Half of target
          fat: 40,       // Half of target
          calories: 1000 // Half of target
        }
      }));

      const score = scoringService.calculateNutritionScore(meals, mockWeeklyGoal);
      expect(score).toBe(50); // 50% of all macros achieved
    });
  });

  describe('calculateTotalScore', () => {
    it('should weight workout score 60% and nutrition score 40%', () => {
      const workoutScore = 80;
      const nutritionScore = 60;
      const expectedTotal = Math.round(80 * 0.6 + 60 * 0.4); // 48 + 24 = 72
      
      const totalScore = scoringService.calculateTotalScore(workoutScore, nutritionScore);
      expect(totalScore).toBe(expectedTotal);
    });

    it('should handle perfect scores', () => {
      const totalScore = scoringService.calculateTotalScore(100, 100);
      expect(totalScore).toBe(100);
    });

    it('should handle zero scores', () => {
      const totalScore = scoringService.calculateTotalScore(0, 0);
      expect(totalScore).toBe(0);
    });
  });

  describe('generateScoreEntry', () => {
    it('should generate a complete score entry', () => {
      const workouts: WorkoutEntry[] = [
        {
          id: '1', userId: 'user1', date: new Date(), type: 'Cardio',
          duration: 30, caloriesBurned: 300
        },
        {
          id: '2', userId: 'user1', date: new Date(), type: 'Strength',
          duration: 45, caloriesBurned: 200
        }
      ];

      const meals: Meal[] = [
        {
          id: 'meal1', userId: 'user1', date: new Date(),
          mealType: 'lunch', name: 'Test Meal', calories: 500,
          macros: { protein: 30, carbs: 50, fat: 20, calories: 500 }
        }
      ];

      const scoreEntry = scoringService.generateScoreEntry(
        'user1', 'challenge1', 1, workouts, meals, mockWeeklyGoal
      );

      expect(scoreEntry.userId).toBe('user1');
      expect(scoreEntry.challengeId).toBe('challenge1');
      expect(scoreEntry.week).toBe(1);
      expect(scoreEntry.workoutScore).toBe(50); // 2/4 workouts
      expect(scoreEntry.nutritionScore).toBeGreaterThan(0);
      expect(scoreEntry.totalScore).toBeGreaterThan(0);
      expect(scoreEntry.calculatedAt).toBeInstanceOf(Date);
      expect(scoreEntry.id).toContain('score_user1_challenge1_1');
    });
  });

  describe('calculateLeaderboard', () => {
    it('should rank users by total score descending', () => {
      const scores: ScoreEntry[] = [
        {
          id: '1', userId: 'user1', challengeId: 'challenge1', week: 1,
          workoutScore: 80, nutritionScore: 70, totalScore: 76, calculatedAt: new Date()
        },
        {
          id: '2', userId: 'user2', challengeId: 'challenge1', week: 1,
          workoutScore: 90, nutritionScore: 85, totalScore: 88, calculatedAt: new Date()
        },
        {
          id: '3', userId: 'user3', challengeId: 'challenge1', week: 1,
          workoutScore: 60, nutritionScore: 65, totalScore: 62, calculatedAt: new Date()
        },
        {
          id: '4', userId: 'user1', challengeId: 'challenge1', week: 2,
          workoutScore: 85, nutritionScore: 80, totalScore: 83, calculatedAt: new Date()
        }
      ];

      const leaderboard = scoringService.calculateLeaderboard(scores);

      // user1: 76 + 83 = 159, user2: 88, user3: 62
      expect(leaderboard).toHaveLength(3);
      expect(leaderboard[0]).toEqual({ userId: 'user1', totalScore: 159, rank: 1 });
      expect(leaderboard[1]).toEqual({ userId: 'user2', totalScore: 88, rank: 2 });
      expect(leaderboard[2]).toEqual({ userId: 'user3', totalScore: 62, rank: 3 });
    });

    it('should handle empty scores array', () => {
      const leaderboard = scoringService.calculateLeaderboard([]);
      expect(leaderboard).toHaveLength(0);
    });

    it('should handle single user', () => {
      const scores: ScoreEntry[] = [
        {
          id: '1', userId: 'user1', challengeId: 'challenge1', week: 1,
          workoutScore: 80, nutritionScore: 70, totalScore: 76, calculatedAt: new Date()
        }
      ];

      const leaderboard = scoringService.calculateLeaderboard(scores);
      expect(leaderboard).toHaveLength(1);
      expect(leaderboard[0]).toEqual({ userId: 'user1', totalScore: 76, rank: 1 });
    });
  });
});