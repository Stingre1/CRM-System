import User from '../models/userModel.js';

const editUser = async (req, res) => {
  const { userId } = req.params.userId;
  const { ...fields } = req.body;

    // Handle empty string fields by explicitly setting them if necessary
    const updateFields = {};

    if (!name) {
      updateFields.name = name;
    }
    if (!email) {
      updateFields.email = email;
    }
    if (!role) {
      updateFields.role = role;
    }

  try {
    // Use findByIdAndUpdate for a more concise update
    const user = await User.findByIdAndUpdate(
      userId,  // find by userId
      updateFields,
      { new: false, runValidators: true }  // return the updated user and validate the changes
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;

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

export { deleteUser, editUser };
