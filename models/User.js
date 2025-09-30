const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  workoutData: [{
    date: {
      type: Date,
      default: Date.now
    },
    protein: {
      type: Number,
      default: 0
    },
    calories: {
      type: Number,
      default: 0
    },
    workoutMinutes: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);