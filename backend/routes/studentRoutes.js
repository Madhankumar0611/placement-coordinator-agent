const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadResume,
} = require('../controllers/studentController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Any logged-in user (coordinator or student) can view records.
router.get('/', protect, getStudents);
router.get('/:id', protect, getStudentById);

// Only coordinators/admins can create, edit, delete, or upload on behalf of a student.
router.post('/', protect, requireRole('coordinator', 'admin'), createStudent);
router.put('/:id', protect, requireRole('coordinator', 'admin'), updateStudent);
router.delete('/:id', protect, requireRole('coordinator', 'admin'), deleteStudent);
router.post('/:id/resume', protect, requireRole('coordinator', 'admin'), upload.single('resume'), uploadResume);

module.exports = router;
