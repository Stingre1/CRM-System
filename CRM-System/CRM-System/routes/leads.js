const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all leads (Admin and Sales Manager) or assigned leads (Sales Rep)
router.get('/', auth, async (req, res) => {
  try {
    let leads;
    if (req.user.role === 'Admin' || req.user.role === 'Sales Manager') {
      leads = await Lead.find({});
    } else {
      leads = await Lead.find({ assignedTo: req.user._id });
    }
    res.send(leads);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new lead (All roles)
router.post('/', auth, async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).send(lead);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a lead (All roles, but Sales Rep can only update assigned leads)
router.put('/:id', auth, async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).send();
    }
    if (req.user.role === 'Sales Rep' && lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Not authorized' });
    }
    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(lead);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Assign a lead (Admin and Sales Manager only)
router.post('/:id/assign', auth, async (req, res) => {
  if (req.user.role === 'Sales Rep') {
    return res.status(403).send({ error: 'Not authorized' });
  }
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    );
    if (!lead) {
      return res.status(404).send();
    }
    res.send(lead);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

