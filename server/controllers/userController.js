const editUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email, role } = req.body;
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully.' });
    } catch (err) {
      console.error(err);
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
    }
  };

  export {deleteUser, editUser};