import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';


// Get current user details
export const getMe = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    // Decode the token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Find the user by ID and exclude the password field
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log("Me: ", user);

    // Return user details
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get all sales reps
export const getSalesReps = async (req, res) => {
  try {
    
    const salesReps = await User.find({ role: 'Sales Rep' });
    
    // console.log("Sales reps: ", salesReps);

    if (!salesReps || salesReps.length === 0) {
      return res.status(404).json({ message: 'No sales reps found' });
    }

    res.status(200).json(salesReps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load sales reps' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params.id; // Extract the ID from the request parameters
  try {
    const user = await User.findById(id); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Send the user as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(req.body)

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: `All fields are required.` });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
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

    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const editUser = async (req, res) => {
  const id = req.params.userId;
  const updates = req.body;

  console.log(id);

  try {
      // Step 1: Validate the fields in the request body
      const validFields = ['name', 'email', 'role'];
      const updateKeys = Object.keys(updates);

      if (!updateKeys.every(key => validFields.includes(key))) {
          return res.status(400).json({ message: 'Invalid fields in request body' });
      }

      // Step 2: Check if the email is unique (if email is being updated)
      if (updates.email) {
          const existingUser = await User.findOne({ email: updates.email });
          if (existingUser && existingUser._id.toString() !== id) {
              return res.status(400).json({ message: 'Email already in use' });
          }
      }

      // Step 3: Update the user
      const updatedUser = await User.findByIdAndUpdate(id, updates, {
          new: true,
          runValidators: true,
      });

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(`User ${updatedUser.name} updated successfully. `);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



export { getAllUsers, getUserById, createUser, deleteUser, editUser };
