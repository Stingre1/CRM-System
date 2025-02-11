import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap'; // Import Modal and Form
import { leadsAPI, usersAPI } from '../services/api';

function LeadManagement() {
  const [salesReps, setSalesReps] = useState([]); // State to store sales reps
  const [currentUser, setCurrentUser] = useState(null); // State to store current user
  
  const [leads, setLeads] = useState([]); // To store leads from API

  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(''); // For error messages
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  
  const [selectedLead, setSelectedLead] = useState(null); // To store the lead being edited
  const [formData, setFormData] = useState({ // To store form data
    leadName: '',
    phoneNumber: '',
    email: '',
    status: 'New', // Default status
    leadDetails: '',
    assignedTo: '', // If you decide to include assignedTo in the form
  });
  

  const loadLeads = async () => {
    try {
      setLoading(true); // Set loading to true before API call
      setError(''); // Clear any previous errors
      const data = await leadsAPI.getLeads();

      console.log("Leads: ", data.leads);
      setLeads(data.leads || []); // Update leads state with fetched data, default to empty array if data.leads is undefined
    } catch (err) {
      setError('Failed to load leads'); // Set error message if API call fails
    } finally {
      setLoading(false); // Set loading to false after API call (success or failure)
    }
  };

  const loadSalesReps = async () => {
    try {
      const data = await usersAPI.getSalesReps();
      setSalesReps(data);
      console.log("Sales Rep: ", data);
    } catch (err) {
      setError('Failed to load Sales Reps');
    }
  };

  const loadCurrentUser = async () => {
    try {
      const userData = await usersAPI.getMe(); // Fetch current user data
      console.log(userData)
      setCurrentUser(userData || {}); // Set the current user in state
    } catch (err) {
      setError('Failed to load current user');
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadLeads();
    loadSalesReps();
  }, []);

  const handleShowModal = (lead = null) => {
    if (lead) {
      setSelectedLead(lead); // Set selectedLead for editing
      setFormData({ // Pre-fill form data with lead's details
        leadName: lead.leadName,
        phoneNumber: lead.phoneNumber,
        email: lead.email,
        status: lead.status,
        leadDetails: lead.leadDetails,
        assignedTo: lead.assignedTo ? lead.assignedTo : '', // Handle assignedTo if needed
      });
    } else {
      setSelectedLead(null); // Clear selectedLead for adding new lead
      setFormData({ // Reset form data for new lead
        leadName: '',
        phoneNumber: '',
        email: '',
        status: 'New',
        leadDetails: '',
        assignedTo: '',
      });
    }
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setError(''); // Clear any errors when closing modal
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let formDataToSubmit = { ...formData }; // Create a copy to modify

      if (currentUser && currentUser.role === 'SalesRep') {
        formDataToSubmit.assignedTo = currentUser._id; // Auto-assign to Sales Rep
      }

      if (selectedLead) {
        await leadsAPI.updateLead(selectedLead._id, formDataToSubmit);
      } else {
        await leadsAPI.createLead(formDataToSubmit);
      }

      await loadLeads();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) { // Confirmation dialog
      setLoading(true); // Set loading to true before API call
      setError(''); // Clear any previous errors
      try {
        await leadsAPI.deleteLead(leadId); // API call to delete lead
        await loadLeads(); // Re-fetch leads to update the table
      } catch (err) {
        setError('Failed to delete lead'); // Set error message if API call fails
        console.error("Error deleting lead:", err); // Log the error for debugging
      } finally {
        setLoading(false); // Set loading to false after API call (success or failure)
      }
    }
  };

  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ marginRight: '20px'}}>Lead Management</h1>
        {currentUser && currentUser.role !== 'Sales Rep' && (
          <Button onClick={() => handleShowModal()} className='addNewLeadButton' disabled={loading}>
            Add New Lead
          </Button>
        )}
      </div>

      {loading && <p>Loading leads...</p>} {/* Loading indicator */}
      {error && <Alert variant="danger">{error}</Alert>} {/* Error message */}
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            {currentUser && currentUser.role !== 'SalesRep' && ( // Conditional header
                <th>Assigned To</th>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={currentUser && currentUser.role !== 'SalesRep' ? "5" : "4"} className="text-center">Loading leads...</td></tr>
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={currentUser && currentUser.role !== 'SalesRep' ? "5" : "4"} className="text-center">No leads found</td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.leadName}</td>
                <td>{lead.email}</td>
                <td>{lead.status}</td>
                {currentUser && currentUser.role !== 'SalesRep' && ( // Conditional cell
                  <td>
                    {lead.assignedTo && lead.assignedTo.name ? lead.assignedTo.name : 'Not Assigned'}
                  </td>
                )}
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(lead)}>Edit</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLead(lead._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}> {/* Modal Component */}
        <Modal.Header closeButton>
          <Modal.Title>{selectedLead ? 'Edit Lead' : 'Add New Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Lead Name */}
            <Form.Group className="mb-3">
              <Form.Label>Lead Name</Form.Label>
              <Form.Control
                type="text"
                name="leadName"
                value={formData.leadName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Phone Number */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Status Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </Form.Control>
            </Form.Group>

            {/* Assigned Sales Rep Dropdown (Conditional Rendering) */}
            {currentUser && currentUser.role !== 'SalesRep' && (
              <Form.Group className="mb-3">
                <Form.Label>Assign Sales Rep</Form.Label>
                <Form.Control
                  as="select"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  <option value="">Select Sales Rep</option>
                  {salesReps.map((rep) => (
                    <option key={rep._id} value={rep._id}>
                      {rep.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            {/* Lead Details (Notes) */}
            <Form.Group className="mb-3">
              <Form.Label>Lead Details</Form.Label>
              <Form.Control
                as="textarea"
                name="leadDetails"
                value={formData.leadDetails}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Submit Button */}            
            <Button type="submit" disabled={loading}>
                {selectedLead ? 'Update' : 'Create'}
            </Button>

          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LeadManagement;