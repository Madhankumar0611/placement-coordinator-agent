const Placement = require('../models/Placement');
const Student = require('../models/Student');

exports.getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate('studentId', 'name rollNo department')
      .populate('companyId', 'companyName packageLPA');
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPlacement = async (req, res) => {
  try {
    const placement = await Placement.create(req.body);

    if (placement.status === 'Selected') {
      await Student.findByIdAndUpdate(placement.studentId, { placementStatus: 'Placed' });
    }

    res.status(201).json(placement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!placement) return res.status(404).json({ message: 'Placement not found' });

    if (placement.status === 'Selected') {
      await Student.findByIdAndUpdate(placement.studentId, { placementStatus: 'Placed' });
    }

    res.json(placement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const pendingStudents = await Student.countDocuments({ placementStatus: 'Pending' });
    const notPlaced = await Student.countDocuments({ placementStatus: 'Not Placed' });

    const companyWise = await Placement.aggregate([
      { $match: { status: 'Selected' } },
      { $group: { _id: '$companyId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $unwind: '$company' },
      { $project: { companyName: '$company.companyName', count: 1, _id: 0 } },
    ]);

    res.json({
      totalStudents,
      placedStudents,
      pendingStudents,
      notPlaced,
      eligibleStudents: totalStudents - notPlaced,
      companyWise,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
