import express from 'express';
import { DataService } from '../services/dataService';
import { ScoringService } from '../services/scoringService';

const router = express.Router();

export function createLeaderboardRoutes(dataService: DataService, scoringService: ScoringService) {
  // Get challenge leaderboard
  router.get('/challenge/:challengeId', (req, res) => {
    const challengeId = req.params.challengeId;
    const scores = dataService.getScoresByChallenge(challengeId);
    const leaderboard = scoringService.calculateLeaderboard(scores);
    
    // Enrich with user details
    const enrichedLeaderboard = leaderboard.map(entry => {
      const user = dataService.getUser(entry.userId);
      return {
        ...entry,
        username: user?.username || 'Unknown',
        firstName: user?.firstName || 'Unknown',
        lastName: user?.lastName || 'Unknown'
      };
    });

    res.json(enrichedLeaderboard);
  });

  // Get league leaderboard (all challenges in league)
  router.get('/league/:leagueId', (req, res) => {
    const leagueId = req.params.leagueId;
    const challenges = dataService.getAllChallenges().filter(c => c.leagueId === leagueId);
    
    let allScores: any[] = [];
    challenges.forEach(challenge => {
      const challengeScores = dataService.getScoresByChallenge(challenge.id);
      allScores = allScores.concat(challengeScores);
    });

    const leaderboard = scoringService.calculateLeaderboard(allScores);
    
    // Enrich with user details
    const enrichedLeaderboard = leaderboard.map(entry => {
      const user = dataService.getUser(entry.userId);
      return {
        ...entry,
        username: user?.username || 'Unknown',
        firstName: user?.firstName || 'Unknown',
        lastName: user?.lastName || 'Unknown'
      };
    });

    res.json(enrichedLeaderboard);
  });

  return router;
}