import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: `All fields are required.`});
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists."});
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: "Username/Email and Password fields are required."});
  }

  try {
    const user = usernameOrEmail.includes('@')
      ? await User.findOne({ email: usernameOrEmail })
      : await User.findOne({ username: usernameOrEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials."});
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET_KEY is not defined.');
      throw new Error('Server misconfiguration.');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Logged in successfully.', token });
  } catch (err) {
    return(err)
  }
};

export { registerUser, login };
