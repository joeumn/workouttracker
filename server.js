const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/groups', require('./routes/groups'));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Workout Tracker API is running' });
});

// Database connection
const connectDB = async () => {
  try {
    // Use a default MongoDB URI for development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workouttracker';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;