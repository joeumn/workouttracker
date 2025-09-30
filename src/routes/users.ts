import express from 'express';
import { DataService } from '../services/dataService';

const router = express.Router();

export function createUserRoutes(dataService: DataService) {
  // Get all users
  router.get('/', (req, res) => {
    const users = dataService.getAllUsers();
    res.json(users);
  });

  // Get user by ID
  router.get('/:id', (req, res) => {
    const user = dataService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });

  // Get user's buddy matches
  router.get('/:id/buddies', (req, res) => {
    const buddyMatches = dataService.getBuddyMatchesForUser(req.params.id);
    res.json(buddyMatches);
  });

  // Get user's workouts
  router.get('/:id/workouts', (req, res) => {
    const workouts = dataService.getWorkoutsByUser(req.params.id);
    res.json(workouts);
  });

  // Get user's meals
  router.get('/:id/meals', (req, res) => {
    const meals = dataService.getMealsByUser(req.params.id);
    res.json(meals);
  });

  // Get user's scores
  router.get('/:id/scores', (req, res) => {
    const scores = dataService.getScoresByUser(req.params.id);
    res.json(scores);
  });

  return router;
}