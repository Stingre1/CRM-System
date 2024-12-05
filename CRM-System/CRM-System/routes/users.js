const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).send({ error: 'Not authorized' });
  }
  const users = await User.find({});
  res.send(users);
});

// Create a new user (Admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).send({ error: 'Not authorized' });
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a user (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).send({ error: 'Not authorized' });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).send({ error: 'Not authorized' });
  }
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

