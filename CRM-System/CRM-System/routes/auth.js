const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
