import { WorkoutEntry, Meal, MacroTargets, WeeklyGoal, ScoreEntry } from '../models/types';

export class ScoringService {
  /**
   * Calculate workout score based on weekly goals
   */
  calculateWorkoutScore(workouts: WorkoutEntry[], weeklyGoal: WeeklyGoal): number {
    const totalWorkouts = workouts.length;
    const targetWorkouts = weeklyGoal.workoutTarget;
    
    if (totalWorkouts === 0) return 0;
    if (totalWorkouts >= targetWorkouts) return 100;
    
    return Math.round((totalWorkouts / targetWorkouts) * 100);
  }

  /**
   * Calculate nutrition score based on macro targets
   */
  calculateNutritionScore(meals: Meal[], weeklyGoal: WeeklyGoal): number {
    if (meals.length === 0) return 0;

    const totalMacros = meals.reduce((acc, meal) => ({
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fat: acc.fat + meal.macros.fat,
      calories: acc.calories + meal.macros.calories
    }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

    const dailyAverage = {
      protein: totalMacros.protein / 7,
      carbs: totalMacros.carbs / 7,
      fat: totalMacros.fat / 7,
      calories: totalMacros.calories / 7
    };

    const targets = weeklyGoal.macroTargets;
    
    // Calculate percentage achieved for each macro
    const proteinScore = Math.min(100, (dailyAverage.protein / targets.protein) * 100);
    const carbsScore = Math.min(100, (dailyAverage.carbs / targets.carbs) * 100);
    const fatScore = Math.min(100, (dailyAverage.fat / targets.fat) * 100);
    const calorieScore = Math.min(100, (dailyAverage.calories / targets.calories) * 100);

    // Average all macro scores
    return Math.round((proteinScore + carbsScore + fatScore + calorieScore) / 4);
  }

  /**
   * Calculate total weekly score
   */
  calculateTotalScore(workoutScore: number, nutritionScore: number): number {
    return Math.round((workoutScore * 0.6) + (nutritionScore * 0.4));
  }

  /**
   * Generate score entry for a user's week
   */
  generateScoreEntry(
    userId: string,
    challengeId: string,
    week: number,
    workouts: WorkoutEntry[],
    meals: Meal[],
    weeklyGoal: WeeklyGoal
  ): ScoreEntry {
    const workoutScore = this.calculateWorkoutScore(workouts, weeklyGoal);
    const nutritionScore = this.calculateNutritionScore(meals, weeklyGoal);
    const totalScore = this.calculateTotalScore(workoutScore, nutritionScore);

    return {
      id: `score_${userId}_${challengeId}_${week}_${Date.now()}`,
      userId,
      challengeId,
      week,
      workoutScore,
      nutritionScore,
      totalScore,
      calculatedAt: new Date()
    };
  }

  /**
   * Calculate leaderboard rankings
   */
  calculateLeaderboard(scores: ScoreEntry[]): Array<{userId: string, totalScore: number, rank: number}> {
    const userScores = new Map<string, number>();
    
    // Sum all scores for each user
    scores.forEach(score => {
      const currentScore = userScores.get(score.userId) || 0;
      userScores.set(score.userId, currentScore + score.totalScore);
    });

    // Sort by total score descending and assign ranks
    return Array.from(userScores.entries())
      .map(([userId, totalScore]) => ({ userId, totalScore, rank: 0 }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }
}