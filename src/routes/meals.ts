import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { CreateMealSchema } from '../types/schemas';
import { dataStore } from '../utils/dataStore';
import { generateId } from '../utils/idGenerator';

const router = Router();

// GET /api/meals - Get user's meals
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const meals = dataStore.getMealsByUserId(req.userId!);
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/meals - Create a new meal
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const validation = CreateMealSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const mealData = validation.data;
    const now = new Date();
    
    const meal = {
      id: generateId(),
      userId: req.userId!,
      name: mealData.name,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fat: mealData.fat,
      date: mealData.date ? new Date(mealData.date) : now,
      createdAt: now,
    };

    dataStore.createMeal(meal);
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;