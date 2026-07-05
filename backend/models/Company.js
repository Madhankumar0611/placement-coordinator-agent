const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    role: { type: String },
    packageLPA: { type: Number, required: true },
    cgpaCriteria: { type: Number, required: true },
    maxArrears: { type: Number, default: 0 },
    departmentsAllowed: [{ type: String }],
    requiredSkills: [{ type: String }],
    interviewDate: { type: Date },
    driveStatus: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
