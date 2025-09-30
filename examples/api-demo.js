// Example usage of the Workout Tracker API
// This demonstrates the structure and expected responses

console.log('🏃‍♂️ Workout Tracker API Demo\n');

// Example data
const exampleUsers = [
  { _id: '507f1f77bcf86cd799439011', username: 'john_doe' },
  { _id: '507f1f77bcf86cd799439012', username: 'jane_doe' }
];

console.log('📋 Available API Endpoints:');
console.log('GET  /api/health - Check API status');
console.log('GET  /api/groups - List all groups');
console.log('POST /api/groups - Create a new group');
console.log('POST /api/groups/:id/invite - Join a group');
console.log('GET  /api/groups/:id/challenges - List group challenges');
console.log('POST /api/groups/:id/challenges - Create a challenge');
console.log('GET  /api/groups/:id/leaderboard?metric=protein&window=week - View leaderboard');
console.log();

console.log('📝 Example Group Creation Request:');
const groupData = {
  name: 'Fitness Enthusiasts',
  description: 'A group for fitness lovers',
  ownerId: exampleUsers[0]._id
};
console.log(JSON.stringify(groupData, null, 2));
console.log();

console.log('🏆 Example Leaderboard Response:');
const exampleLeaderboard = {
  group: { _id: 'groupId', name: 'Fitness Enthusiasts' },
  metric: 'protein',
  window: 'week',
  period: {
    startDate: '2023-01-02T00:00:00.000Z',
    endDate: '2023-01-08T23:59:59.999Z'
  },
  leaderboard: [
    {
      rank: 1,
      user: { _id: exampleUsers[0]._id, username: exampleUsers[0].username },
      total: 650,
      entries: 7,
      average: 92.86,
      lastActivity: Date.now()
    },
    {
      rank: 2,
      user: { _id: exampleUsers[1]._id, username: exampleUsers[1].username },
      total: 580,
      entries: 6,
      average: 96.67,
      lastActivity: Date.now() - 86400000
    }
  ]
};
console.log(JSON.stringify(exampleLeaderboard, null, 2));
console.log();

console.log('🚀 To start the server:');
console.log('1. Ensure MongoDB is running');
console.log('2. Run: npm start');
console.log('3. API will be available at http://localhost:3000');
console.log();

console.log('🧪 To run tests:');
console.log('npm test');
console.log();

console.log('📖 For detailed API documentation, see API.md');

module.exports = { exampleUsers, groupData, exampleLeaderboard };