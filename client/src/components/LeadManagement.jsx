import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('/api/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleShowModal = (lead = {}) => {
    setCurrentLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentLead({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentLead._id) {
        await axios.put(`/api/leads/${currentLead._id}`, currentLead);
      } else {
        await axios.post('/api/leads', currentLead);
      }
      fetchLeads();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentLead({ ...currentLead, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-5">
      <h2>Lead Management</h2>
      <Button variant="primary" onClick={() => handleShowModal()}>Add New Lead</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.status}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal(lead)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentLead._id ? 'Edit Lead' : 'Add New Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentLead.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentLead.email || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={currentLead.phone || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentLead.status || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
                <option value="Closed">Closed</option>
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

export default LeadManagement;

