import express from 'express';
import path from 'path';
import { DataService } from './services/dataService';
import { ScoringService } from './services/scoringService';
import { seedDatabase } from './utils/seedData';
import { createUserRoutes } from './routes/users';
import { createLeaderboardRoutes } from './routes/leaderboard';
import { createMacroRoutes } from './routes/macros';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize services
const dataService = new DataService();
const scoringService = new ScoringService();

// Seed database on startup
seedDatabase(dataService);

// Routes
app.use('/api/users', createUserRoutes(dataService));
app.use('/api/leaderboard', createLeaderboardRoutes(dataService, scoringService));
app.use('/api/macros', createMacroRoutes(dataService));

// Basic API routes
app.get('/api/leagues', (req, res) => {
  const leagues = dataService.getAllLeagues();
  res.json(leagues);
});

app.get('/api/challenges', (req, res) => {
  const challenges = dataService.getAllChallenges();
  res.json(challenges);
});

app.get('/api/posts', (req, res) => {
  const posts = dataService.getAllPosts();
  res.json(posts);
});

app.get('/api/buddy-matches', (req, res) => {
  const buddyMatches = dataService.getAllBuddyMatches();
  res.json(buddyMatches);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;

// Start server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Workout Tracker API running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`API endpoints available:`);
    console.log(`  - GET /api/users`);
    console.log(`  - GET /api/leagues`);
    console.log(`  - GET /api/challenges`);
    console.log(`  - GET /api/posts`);
    console.log(`  - GET /api/buddy-matches`);
    console.log(`  - GET /api/leaderboard/challenge/:challengeId`);
    console.log(`  - GET /api/macros/user/:userId`);
  });
}