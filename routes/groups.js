const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

// Helper function to get start and end of week (ISO format)
const getWeekBounds = (date = new Date()) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday is start of week
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { startOfWeek, endOfWeek };
};

// Helper function to calculate leaderboard scores with tie-breakers
const calculateLeaderboard = (users, metric, startDate, endDate) => {
  const scores = users.map(user => {
    const workoutData = user.workoutData.filter(entry => 
      entry.date >= startDate && entry.date <= endDate
    );
    
    const total = workoutData.reduce((sum, entry) => sum + (entry[metric] || 0), 0);
    const entries = workoutData.length;
    const average = entries > 0 ? total / entries : 0;
    const lastActivity = workoutData.length > 0 ? 
      Math.max(...workoutData.map(entry => entry.date)) : 0;
    
    return {
      user: {
        _id: user._id,
        username: user.username
      },
      total,
      entries,
      average,
      lastActivity
    };
  });
  
  // Sort with tie-breakers: total desc, entries desc, average desc, lastActivity desc
  scores.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.entries !== a.entries) return b.entries - a.entries;
    if (b.average !== a.average) return b.average - a.average;
    return b.lastActivity - a.lastActivity;
  });
  
  return scores.map((score, index) => ({
    rank: index + 1,
    ...score
  }));
};

// GET /api/groups - List all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('owner', 'username')
      .populate('members.user', 'username')
      .select('-inviteCode');
    
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/groups - Create a new group
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be max 500 characters'),
  body('ownerId').isMongoId().withMessage('Valid owner ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, ownerId } = req.body;
    
    // Verify owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(400).json({ message: 'Owner not found' });
    }
    
    // Generate unique invite code
    const inviteCode = crypto.randomBytes(8).toString('hex');
    
    const group = new Group({
      name,
      description,
      owner: ownerId,
      members: [{
        user: ownerId,
        joinedAt: new Date()
      }],
      inviteCode
    });
    
    await group.save();
    await group.populate('owner', 'username');
    await group.populate('members.user', 'username');
    
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/groups/:id/invite - Join a group using invite code
router.post('/:id/invite', [
  body('userId').isMongoId().withMessage('Valid user ID required'),
  body('inviteCode').optional().isLength({ min: 1 }).withMessage('Invite code required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { userId, inviteCode } = req.body;
    
    // Find group
    let group;
    if (inviteCode) {
      group = await Group.findOne({ inviteCode });
    } else {
      group = await Group.findById(id);
    }
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Check if user is already a member
    const existingMember = group.members.find(member => 
      member.user.toString() === userId
    );
    
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    
    // Add user to group
    group.members.push({
      user: userId,
      joinedAt: new Date()
    });
    
    await group.save();
    await group.populate('owner', 'username');
    await group.populate('members.user', 'username');
    
    res.json(group);
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/groups/:id/challenges - Get challenges for a group
router.get('/:id/challenges', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify group exists
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const challenges = await Challenge.find({ group: id })
      .populate('creator', 'username')
      .populate('participants.user', 'username')
      .sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/groups/:id/challenges - Create a challenge for a group
router.post('/:id/challenges', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be max 500 characters'),
  body('creatorId').isMongoId().withMessage('Valid creator ID required'),
  body('metric').isIn(['protein', 'calories', 'workoutMinutes']).withMessage('Invalid metric'),
  body('target').isFloat({ min: 0 }).withMessage('Target must be a positive number'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { title, description, creatorId, metric, target, startDate, endDate } = req.body;
    
    // Verify group exists
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Verify creator is a member of the group
    const isMember = group.members.some(member => 
      member.user.toString() === creatorId
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Creator must be a group member' });
    }
    
    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    const challenge = new Challenge({
      title,
      description,
      group: id,
      creator: creatorId,
      metric,
      target,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      participants: [{
        user: creatorId,
        joinedAt: new Date()
      }]
    });
    
    await challenge.save();
    await challenge.populate('creator', 'username');
    await challenge.populate('participants.user', 'username');
    
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/groups/:id/leaderboard - Get leaderboard for a group
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const { id } = req.params;
    const { metric = 'protein', window = 'week' } = req.query;
    
    // Validate metric
    if (!['protein', 'calories', 'workoutMinutes'].includes(metric)) {
      return res.status(400).json({ message: 'Invalid metric. Use: protein, calories, or workoutMinutes' });
    }
    
    // Validate window
    if (!['week', 'month', 'all'].includes(window)) {
      return res.status(400).json({ message: 'Invalid window. Use: week, month, or all' });
    }
    
    // Verify group exists
    const group = await Group.findById(id).populate('members.user');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Calculate date range based on window
    let startDate, endDate;
    const now = new Date();
    
    if (window === 'week') {
      const bounds = getWeekBounds(now);
      startDate = bounds.startOfWeek;
      endDate = bounds.endOfWeek;
    } else if (window === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      startDate = new Date(0); // Beginning of time
      endDate = now;
    }
    
    // Get users with their workout data
    const userIds = group.members.map(member => member.user._id);
    const users = await User.find({ _id: { $in: userIds } });
    
    // Calculate leaderboard
    const leaderboard = calculateLeaderboard(users, metric, startDate, endDate);
    
    res.json({
      group: {
        _id: group._id,
        name: group.name
      },
      metric,
      window,
      period: {
        startDate,
        endDate
      },
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;