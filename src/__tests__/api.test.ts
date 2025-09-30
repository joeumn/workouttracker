import request from 'supertest';
import app from '../index';

describe('API Endpoints', () => {
  let token: string;
  let userId: string;

  // Register and login before running tests
  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    expect(registerResponse.status).toBe(201);
    token = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  describe('GET /api/me', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('name', 'Test User');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/me');
      expect(response.status).toBe(401);
    });
  });

  describe('Meals API', () => {
    it('should create a new meal', async () => {
      const mealData = {
        name: 'Chicken Breast',
        calories: 200,
        protein: 40,
        carbs: 0,
        fat: 4
      };

      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(mealData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(mealData);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
    });

    it('should get user meals', async () => {
      const response = await request(app)
        .get('/api/meals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should validate meal data', async () => {
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          calories: -100 // Invalid data
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('Workouts API', () => {
    let workoutId: string;

    it('should create a new workout', async () => {
      const workoutData = {
        name: 'Push Day',
        notes: 'Chest, shoulders, triceps'
      };

      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send(workoutData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(workoutData);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
      
      workoutId = response.body.id;
    });

    it('should get user workouts', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should add sets to workout', async () => {
      const setData = {
        exercise: 'Bench Press',
        weight: 80,
        reps: 10
      };

      const response = await request(app)
        .post(`/api/workouts/${workoutId}/sets`)
        .set('Authorization', `Bearer ${token}`)
        .send(setData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(setData);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('workoutId', workoutId);
      expect(response.body).toHaveProperty('order', 0);
    });

    it('should return 404 for non-existent workout', async () => {
      const response = await request(app)
        .post('/api/workouts/non-existent-id/sets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          exercise: 'Push ups',
          weight: 0,
          reps: 20
        });

      expect(response.status).toBe(404);
    });
  });

  describe('Authentication', () => {
    it('should reject requests without token', async () => {
      const response = await request(app).get('/api/workouts');
      expect(response.status).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(403);
    });
  });
});