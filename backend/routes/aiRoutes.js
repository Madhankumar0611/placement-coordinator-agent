const express = require('express');
const router = express.Router();
const {
  checkEligibility,
  reviewResume,
  generateInterviewQuestions,
  generateEmail,
  chat,
  getChatHistory,
} = require('../controllers/aiController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// AI tools students use directly.
router.post('/eligibility', protect, checkEligibility);
router.post('/resume-review', protect, reviewResume);
router.post('/interview-questions', protect, generateInterviewQuestions);
router.post('/chat', protect, chat);

// Coordinator-only: drafting outbound emails to students on behalf of the cell.
router.post('/generate-email', protect, requireRole('coordinator', 'admin'), generateEmail);
router.get('/chat/history', protect, requireRole('coordinator', 'admin'), getChatHistory);

module.exports = router;
