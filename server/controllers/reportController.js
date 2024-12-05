import Lead from '../models/leadModel.js';
import User from '../models/userModel.js'

export const getReports = async (req, res) => {
  try {
    let pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    if (req.user.role === 'Sales Rep') {
      pipeline.unshift({ $match: { assignedTo: req.user._id } });
    } else if (req.user.role === 'Sales Manager') {
      const salesReps = await User.find({ role: 'Sales Rep' });
      const salesRepIds = salesReps.map((rep) => rep._id);
      pipeline.unshift({ $match: { assignedTo: { $in: salesRepIds } } });
    }

    const report = await Lead.aggregate(pipeline);
    res.send(report);
  } catch (error) {
    res.status(500).send(error);
  }
};
