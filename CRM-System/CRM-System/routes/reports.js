const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const router = express.Router();

// Get system-wide reports (Admin and Sales Manager) or self reports (Sales Rep)
router.get('/', auth, async (req, res) => {
  try {
    let pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ];

    if (req.user.role === 'Sales Rep') {
      pipeline.unshift({ $match: { assignedTo: req.user._id } });
    } else if (req.user.role === 'Sales Manager') {
      // For Sales Manager, we need to get the IDs of all Sales Reps
      const salesReps = await User.find({ role: 'Sales Rep' });
      const salesRepIds = salesReps.map(rep => rep._id);
      pipeline.unshift({ $match: { assignedTo: { $in: salesRepIds } } });
    }

    const report = await Lead.aggregate(pipeline);
    res.send(report);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

