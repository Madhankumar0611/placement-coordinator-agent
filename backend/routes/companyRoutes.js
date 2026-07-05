const express = require('express');
const router = express.Router();
const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Any logged-in user can view drives.
router.get('/', protect, getCompanies);

// Only coordinators/admins can manage drives.
router.post('/', protect, requireRole('coordinator', 'admin'), createCompany);
router.put('/:id', protect, requireRole('coordinator', 'admin'), updateCompany);
router.delete('/:id', protect, requireRole('coordinator', 'admin'), deleteCompany);

module.exports = router;
