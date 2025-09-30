const request = require('supertest');
const app = require('../server');

describe('Workout Tracker API', () => {
  describe('Health Check', () => {
    test('GET /api/health should return OK status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Check-ins API', () => {
    test('GET /api/checkins/stats should return initial stats', async () => {
      const response = await request(app)
        .get('/api/checkins/stats')
        .expect(200);
      
      expect(response.body.streak).toBeDefined();
      expect(response.body.thisWeek).toBeDefined();
      expect(response.body.lastWeek).toBeDefined();
      expect(response.body.streak.current_streak).toBeGreaterThanOrEqual(0);
      expect(response.body.streak.total_xp).toBeGreaterThanOrEqual(0);
    });

    test('GET /api/checkins/today should return today\'s check-in or null', async () => {
      const response = await request(app)
        .get('/api/checkins/today')
        .expect(200);
      
      expect(response.body.checkin).toBeDefined();
      // checkin can be null if no check-in today, or an object with date, status, xp
    });

    test('POST /api/checkins should create a "going" check-in', async () => {
      const response = await request(app)
        .post('/api/checkins')
        .send({ status: 'going' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.checkin.status).toBe('going');
      expect(response.body.checkin.xp).toBe(10);
      expect(response.body.streak).toBeDefined();
    });

    test('POST /api/checkins should create a "went" check-in with higher XP', async () => {
      const response = await request(app)
        .post('/api/checkins')
        .send({ status: 'went' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.checkin.status).toBe('went');
      expect(response.body.checkin.xp).toBe(15);
      expect(response.body.streak.current_streak).toBeGreaterThanOrEqual(1);
    });

    test('POST /api/checkins should reject invalid status', async () => {
      const response = await request(app)
        .post('/api/checkins')
        .send({ status: 'invalid' })
        .expect(400);
      
      expect(response.body.error).toContain('Status must be either "went" or "going"');
    });

    test('GET /api/checkins should return all check-ins', async () => {
      const response = await request(app)
        .get('/api/checkins')
        .expect(200);
      
      expect(response.body.checkins).toBeDefined();
      expect(Array.isArray(response.body.checkins)).toBe(true);
    });
  });
});