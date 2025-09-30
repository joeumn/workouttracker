import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { LoginSchema, RegisterSchema } from '../types/schemas';
import { dataStore } from '../utils/dataStore';
import { generateToken } from '../middleware/auth';
import { generateId } from '../utils/idGenerator';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validation = RegisterSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { email, password, name } = validation.data;
    
    // Check if user already exists
    if (dataStore.getUserByEmail(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    
    const user = {
      id: generateId(),
      email,
      password: hashedPassword,
      name,
      createdAt: now,
      updatedAt: now,
    };

    dataStore.createUser(user);
    
    const token = generateToken(user.id);
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = LoginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { email, password } = validation.data;
    
    const user = dataStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, (user as any).password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    // Return user without password
    const { password: _, ...userResponse } = user as any;
    res.json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;