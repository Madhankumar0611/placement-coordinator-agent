const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
