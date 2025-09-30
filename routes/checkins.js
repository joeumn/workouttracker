const express = require('express');
const moment = require('moment');
const Database = require('../database');

const router = express.Router();
let db = null;

// Initialize database connection
async function initDB() {
  if (!db) {
    db = new Database();
    await db.init();
  }
  return db;
}

// Get all check-ins
router.get('/', async (req, res) => {
  try {
    const database = await initDB();
    
    database.getDb().all("SELECT * FROM checkins ORDER BY date DESC", (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ checkins: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's check-in
router.get('/today', async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const database = await initDB();

    database.getDb().get("SELECT * FROM checkins WHERE date = ?", [today], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ checkin: row || null });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current streak and stats
router.get('/stats', async (req, res) => {
  try {
    const database = await initDB();

    database.getDb().get("SELECT * FROM streaks ORDER BY id DESC LIMIT 1", (err, streak) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Get this week's stats
      const thisWeekStart = moment().startOf('week').format('YYYY-MM-DD');
      const thisWeekEnd = moment().endOf('week').format('YYYY-MM-DD');
      
      database.getDb().all(
        "SELECT * FROM checkins WHERE date BETWEEN ? AND ? ORDER BY date",
        [thisWeekStart, thisWeekEnd],
        (err, thisWeek) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // Get last week's stats
          const lastWeekStart = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
          const lastWeekEnd = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
          
          database.getDb().all(
            "SELECT * FROM checkins WHERE date BETWEEN ? AND ? ORDER BY date",
            [lastWeekStart, lastWeekEnd],
            (err, lastWeek) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              // Calculate stats
              const thisWeekXP = thisWeek.reduce((sum, checkin) => sum + (checkin.xp || 0), 0);
              const lastWeekXP = lastWeek.reduce((sum, checkin) => sum + (checkin.xp || 0), 0);
              
              res.json({
                streak: streak || { current_streak: 0, longest_streak: 0, total_xp: 0 },
                thisWeek: {
                  checkins: thisWeek.length,
                  xp: thisWeekXP,
                  days: thisWeek
                },
                lastWeek: {
                  checkins: lastWeek.length,
                  xp: lastWeekXP,
                  days: lastWeek
                }
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update today's check-in
router.post('/', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['went', 'going'].includes(status)) {
      res.status(400).json({ error: 'Status must be either "went" or "going"' });
      return;
    }

    const today = moment().format('YYYY-MM-DD');
    const xp = status === 'went' ? 15 : 10; // More XP for completing workout
    
    const database = await initDB();

    // Check if today already has a check-in
    database.getDb().get("SELECT * FROM checkins WHERE date = ?", [today], (err, existingCheckin) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (existingCheckin) {
        // Update existing check-in
        database.getDb().run(
          "UPDATE checkins SET status = ?, xp = ?, updated_at = CURRENT_TIMESTAMP WHERE date = ?",
          [status, xp, today],
          function(err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            updateStreakAndXP(database.getDb(), today, status, res);
          }
        );
      } else {
        // Create new check-in
        database.getDb().run(
          "INSERT INTO checkins (date, status, xp) VALUES (?, ?, ?)",
          [today, status, xp],
          function(err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            updateStreakAndXP(database.getDb(), today, status, res);
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function updateStreakAndXP(database, today, status, res) {
  // Calculate current streak
  database.all(
    "SELECT date, status FROM checkins ORDER BY date DESC",
    (err, allCheckins) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Calculate streaks (only 'went' status counts for streak)
      for (const checkin of allCheckins) {
        if (checkin.status === 'went') {
          tempStreak++;
          if (checkin.date === today && currentStreak === 0) {
            currentStreak = tempStreak;
          }
        } else {
          if (currentStreak === 0 && checkin.date === today) {
            currentStreak = 0;
          }
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // If we haven't set current streak yet, it means today's checkin is not 'went'
      if (status !== 'went') {
        currentStreak = 0;
      }

      // Calculate total XP
      database.get(
        "SELECT SUM(xp) as total FROM checkins",
        (err, xpResult) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const totalXP = xpResult.total || 0;

          // Update streaks table
          database.run(
            "UPDATE streaks SET current_streak = ?, longest_streak = ?, total_xp = ?, last_checkin_date = ?, updated_at = CURRENT_TIMESTAMP",
            [currentStreak, longestStreak, totalXP, today],
            (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              res.json({
                success: true,
                checkin: { date: today, status, xp: status === 'went' ? 15 : 10 },
                streak: { current_streak: currentStreak, longest_streak: longestStreak, total_xp: totalXP }
              });
            }
          );
        }
      );
    }
  );
}

module.exports = router;