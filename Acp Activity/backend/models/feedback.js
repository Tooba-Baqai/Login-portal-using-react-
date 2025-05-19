const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema); 