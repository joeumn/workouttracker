const request = require('supertest');

// Mock mongoose and models for testing without database
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  Schema: class {
    constructor() {}
  },
  model: jest.fn()
}));

// Mock models
const mockUser = {
  find: jest.fn(),
  findById: jest.fn(),
  deleteMany: jest.fn()
};

const mockGroup = {
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  deleteMany: jest.fn(),
  prototype: {
    save: jest.fn(),
    populate: jest.fn()
  }
};

const mockChallenge = {
  find: jest.fn(),
  deleteMany: jest.fn()
};

jest.mock('../models/User', () => mockUser);
jest.mock('../models/Group', () => mockGroup);
jest.mock('../models/Challenge', () => mockChallenge);

const app = require('../server');

describe('Groups API', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('GET /api/groups', () => {
    it('should return empty array when no groups exist', async () => {
      mockGroup.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([])
      });

      const res = await request(app)
        .get('/api/groups')
        .expect(200);
      
      expect(res.body).toEqual([]);
    });

    it('should handle server errors gracefully', async () => {
      mockGroup.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const res = await request(app)
        .get('/api/groups')
        .expect(500);
      
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('POST /api/groups', () => {
    it('should return validation error for missing required fields', async () => {
      const res = await request(app)
        .post('/api/groups')
        .send({})
        .expect(400);
      
      expect(res.body.errors).toBeDefined();
    });

    it('should return validation error for invalid ownerId', async () => {
      const res = await request(app)
        .post('/api/groups')
        .send({
          name: 'Test Group',
          ownerId: 'invalid-id'
        })
        .expect(400);
      
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/groups/:id/leaderboard', () => {
    it('should return error for invalid metric', async () => {
      const res = await request(app)
        .get('/api/groups/507f1f77bcf86cd799439011/leaderboard?metric=invalid')
        .expect(400);
      
      expect(res.body.message).toContain('Invalid metric');
    });

    it('should return error for invalid window', async () => {
      const res = await request(app)
        .get('/api/groups/507f1f77bcf86cd799439011/leaderboard?window=invalid')
        .expect(400);
      
      expect(res.body.message).toContain('Invalid window');
    });
  });
});

describe('Health Check', () => {
  it('should return OK status', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(res.body.status).toBe('OK');
  });
});