import { useState, useEffect } from 'react';
import { Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import { usersAPI } from '../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');

  const [showUserModal, setShowUserModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Sales Rep',
  });
  const [userErrorModal, setUserErrorModal] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setUserError('');
      const data = await usersAPI.getUsers();
      setUsers(data || []);
      console.log("Users:", data);
    } catch (err) {
      setUserError('Failed to load users.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleShowUserModal = (user = null) => {
    setShowUserModal(true);
    setSelectedUser(user); // Set selectedUser for editing or null for adding
    setUserErrorModal('');
    if (user) {
      // Populate form data for editing
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '', // Do not pre-fill password for security reasons in edit mode
      });
    } else {
      // Reset form data for adding new user
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Sales Rep',
      });
    }
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setUserErrorModal('');
  };

  const handleChangeUserForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserErrorModal('');
    setLoadingModal(true);

    try {
      if (selectedUser) {
        // Update User
        await usersAPI.updateUser(selectedUser._id, formData);
      } else {
        // Create New User
        await usersAPI.createUser(formData);
      }
      await loadUsers(); // Reload users to update table
      handleCloseUserModal();
    } catch (error) {
      setUserErrorModal(error.response?.data?.message || 'Failed to save user.');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoadingUsers(true);
      setUserError('');
      try {
        await usersAPI.deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setUserError('Failed to delete user.');
        console.error("Error deleting user:", err);
      } finally {
        setLoadingUsers(false);
      }
    }
  };


  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ marginRight: '20px'}}>User Management</h1>
        <Button onClick={() => handleShowUserModal()} className='addNewLeadButton' disabled={loadingUsers}>
          Add New User
        </Button>
      </div>

      {loadingUsers && <p>Loading users...</p>}
      {userError && <Alert variant="danger">{userError}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingUsers ? (
            <tr><td colSpan="4" className="text-center">Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowUserModal(user)}>Edit</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showUserModal} onHide={handleCloseUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userErrorModal && <Alert variant="danger">{userErrorModal}</Alert>}
          <Form onSubmit={handleUserSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChangeUserForm}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChangeUserForm}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChangeUserForm}
                required={!selectedUser} // Password required only for new users
                minLength={8}
              />
              <Form.Text muted>
                {selectedUser ? "Leave blank to keep current password." : "Required for new users."}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChangeUserForm}
              >
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Rep">Sales Rep</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loadingModal}>
              {selectedUser ? 'Update User' : 'Create User'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserManagement;