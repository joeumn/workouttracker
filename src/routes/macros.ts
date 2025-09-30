import express from 'express';
import { DataService } from '../services/dataService';

const router = express.Router();

export function createMacroRoutes(dataService: DataService) {
  // Get user's macro tracking for a date range
  router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    const meals = dataService.getMealsByUserAndDateRange(userId, start, end);
    
    // Group meals by date
    const mealsByDate = meals.reduce((acc, meal) => {
      const dateKey = meal.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(meal);
      return acc;
    }, {} as Record<string, typeof meals>);

    // Calculate daily totals
    const dailyTotals = Object.entries(mealsByDate).map(([date, dayMeals]) => {
      const totals = dayMeals.reduce((acc, meal) => ({
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fat: acc.fat + meal.macros.fat,
        calories: acc.calories + meal.macros.calories
      }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

      return {
        date,
        totals,
        meals: dayMeals
      };
    });

    res.json(dailyTotals);
  });

  // Get macro summary for a specific challenge week
  router.get('/challenge/:challengeId/week/:week/user/:userId', (req, res) => {
    const { challengeId, week, userId } = req.params;
    
    const challenge = dataService.getChallenge(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Calculate week start/end dates
    const challengeStart = new Date(challenge.startDate);
    const weekStart = new Date(challengeStart);
    weekStart.setDate(weekStart.getDate() + (parseInt(week) - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const meals = dataService.getMealsByUserAndDateRange(userId, weekStart, weekEnd);
    const weeklyGoal = challenge.weeklyGoals.find(g => g.week === parseInt(week));

    if (!weeklyGoal) {
      return res.status(404).json({ error: 'Weekly goal not found' });
    }

    // Calculate weekly totals
    const weeklyTotals = meals.reduce((acc, meal) => ({
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fat: acc.fat + meal.macros.fat,
      calories: acc.calories + meal.macros.calories
    }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

    // Calculate daily averages
    const dailyAverages = {
      protein: weeklyTotals.protein / 7,
      carbs: weeklyTotals.carbs / 7,
      fat: weeklyTotals.fat / 7,
      calories: weeklyTotals.calories / 7
    };

    // Calculate progress towards goals
    const progress = {
      protein: (dailyAverages.protein / weeklyGoal.macroTargets.protein) * 100,
      carbs: (dailyAverages.carbs / weeklyGoal.macroTargets.carbs) * 100,
      fat: (dailyAverages.fat / weeklyGoal.macroTargets.fat) * 100,
      calories: (dailyAverages.calories / weeklyGoal.macroTargets.calories) * 100
    };

    res.json({
      weeklyTotals,
      dailyAverages,
      targets: weeklyGoal.macroTargets,
      progress,
      meals
    });
  });

  return router;
}