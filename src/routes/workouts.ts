import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { CreateWorkoutSchema, CreateSetSchema } from '../types/schemas';
import { dataStore } from '../utils/dataStore';
import { generateId } from '../utils/idGenerator';

const router = Router();

// GET /api/workouts - Get user's workouts
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const workouts = dataStore.getWorkoutsByUserId(req.userId!);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/workouts - Create a new workout
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const validation = CreateWorkoutSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const workoutData = validation.data;
    const now = new Date();
    
    const workout = {
      id: generateId(),
      userId: req.userId!,
      name: workoutData.name,
      date: workoutData.date ? new Date(workoutData.date) : now,
      notes: workoutData.notes,
      createdAt: now,
    };

    dataStore.createWorkout(workout);
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/workouts/:id/sets - Add sets to a workout
router.post('/:id/sets', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const workoutId = req.params.id;
    
    // Check if workout exists and belongs to user
    const workout = dataStore.getWorkoutById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    if (workout.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validation = CreateSetSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const setData = validation.data;
    
    // Get current sets to determine order
    const existingSets = dataStore.getSetsByWorkoutId(workoutId);
    const nextOrder = existingSets.length;
    
    const set = {
      id: generateId(),
      workoutId,
      exercise: setData.exercise,
      weight: setData.weight,
      reps: setData.reps,
      order: nextOrder,
      createdAt: new Date(),
    };

    dataStore.createSet(set);
    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;