import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { dataStore } from '../utils/dataStore';

const router = Router();

// GET /api/me - Get current user profile
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const user = dataStore.getUserById(req.userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without sensitive data
    const { password, ...userProfile } = user as any;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;