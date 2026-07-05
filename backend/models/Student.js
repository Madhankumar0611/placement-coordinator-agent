const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    arrears: { type: Number, default: 0 },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    placementStatus: {
      type: String,
      enum: ['Not Placed', 'Placed', 'Pending'],
      default: 'Not Placed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
