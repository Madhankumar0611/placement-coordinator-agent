const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placement', placementSchema);
