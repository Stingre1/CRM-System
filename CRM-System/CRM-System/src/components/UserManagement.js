import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const { currentUser: authUser } = useAuth();

  useEffect(() => {
    if (authUser.role !== 'Admin') {
      // Redirect or show error message
      return;
    }
    fetchUsers();
  }, [authUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowModal = (user = {}) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser._id) {
        await axios.put(`/api/users/${currentUser._id}`, currentUser);
      } else {
        await axios.post('/api/users', currentUser);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="mt-5">
      <h2>User Management</h2>
      <Button variant="primary" onClick={() => handleShowModal()}>Add New User</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal(user)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser._id ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={currentUser.username || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {!currentUser._id && (
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={currentUser.password || ''}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={currentUser.role || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Rep">Sales Rep</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserManagement;

