const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, 'workouttracker.db');
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Connected to SQLite database');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const createCheckinsTable = `
        CREATE TABLE IF NOT EXISTS checkins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('went', 'going')),
          xp INTEGER DEFAULT 10,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const createStreaksTable = `
        CREATE TABLE IF NOT EXISTS streaks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          last_checkin_date TEXT,
          total_xp INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.serialize(() => {
        this.db.run(createCheckinsTable, (err) => {
          if (err) {
            reject(err);
            return;
          }
        });

        this.db.run(createStreaksTable, (err) => {
          if (err) {
            reject(err);
            return;
          }
        });

        // Initialize streaks table with default values if empty
        this.db.get("SELECT COUNT(*) as count FROM streaks", (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          if (row.count === 0) {
            this.db.run("INSERT INTO streaks (current_streak, longest_streak, total_xp) VALUES (0, 0, 0)", (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  }

  getDb() {
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = Database;