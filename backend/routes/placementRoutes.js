const express = require('express');
const router = express.Router();
const {
  getPlacements,
  createPlacement,
  updatePlacement,
  getStats,
} = require('../controllers/placementController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/', protect, getPlacements);
router.get('/stats/summary', protect, getStats);

// Only coordinators/admins can record or update placement outcomes.
router.post('/', protect, requireRole('coordinator', 'admin'), createPlacement);
router.put('/:id', protect, requireRole('coordinator', 'admin'), updatePlacement);

module.exports = router;
