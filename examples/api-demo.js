// Example usage of the Workout Tracker API
// This demonstrates how to use all the implemented endpoints

const axios = require('axios');

// Change this to your server URL
const BASE_URL = 'http://localhost:3000/api';

// Example data
const exampleUsers = [
  { _id: '507f1f77bcf86cd799439011', username: 'john_doe' },
  { _id: '507f1f77bcf86cd799439012', username: 'jane_doe' }
];

async function demonstrateAPI() {
  try {
    console.log('🏃‍♂️ Workout Tracker API Demo\n');

    // 1. Check API health
    console.log('1. Checking API health...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ API Status:', health.data.status);
    console.log();

    // 2. Create a group
    console.log('2. Creating a new group...');
    const groupData = {
      name: 'Fitness Enthusiasts',
      description: 'A group for fitness lovers',
      ownerId: exampleUsers[0]._id
    };
    
    // Note: This will fail without a database connection, but shows the API structure
    console.log('Group data to create:', JSON.stringify(groupData, null, 2));
    console.log();

    // 3. Example API calls (structure)
    console.log('3. Example API endpoints:');
    console.log('POST /api/groups - Create group');
    console.log('GET /api/groups - List groups');
    console.log('POST /api/groups/:id/invite - Join group');
    console.log('GET /api/groups/:id/challenges - List challenges');
    console.log('POST /api/groups/:id/challenges - Create challenge');
    console.log('GET /api/groups/:id/leaderboard?metric=protein&window=week - View leaderboard');
    console.log();

    // 4. Leaderboard example
    console.log('4. Leaderboard example response:');
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

  } catch (error) {
    console.error('Demo error (expected without database):', error.message);
    console.log('\n💡 To fully test the API, start MongoDB and run the server with:');
    console.log('   npm start');
  }
}

// Add axios as a dependency for the example
if (require.main === module) {
  console.log('Install axios to run this demo: npm install axios');
  console.log('Then start the server and run: node examples/api-demo.js\n');
  demonstrateAPI();
}

module.exports = { demonstrateAPI };