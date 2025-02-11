import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { contactsAPI, leadsAPI, usersAPI } from '../services/api';

function ContactManagement() {
  const [currentUser, setCurrentUser] = useState(null); // Initialize state for current user
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    title: '',
    notes: '',
    lead: '',
    salesRep: '',
  });

  useEffect(() => {
    loadContacts();
    loadCurrentUser();
    loadLeads();
    loadSalesReps();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await usersAPI.getMe(); // Fetch current user data
      setCurrentUser(userData || {}); // Set the current user in state
    } catch (err) {
      setError('Failed to load current user');
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsAPI.getContacts();
      setContacts(data.contacts || []);
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    try {
      const data = await leadsAPI.getLeads();
      console.log("Leads: ",data.leads);
      setLeads(data.leads || []);
    } catch (err) {
      setError('Failed to load leads');
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

  const handleShowModal = (contact = null) => {
    if (contact) {
      console.log("Contact object being edited:", contact);
      setSelectedContact(contact);
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        notes: contact.notes,
        lead: contact.lead ? contact.lead._id : '',
        salesRep: contact.salesRep ? contact.salesRep : '',
      });
      console.log("Form Data being set in handleShowModal:", formData); // ADD THIS LINE AFTER setFormData
    } else {
      setSelectedContact(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        notes: '',
        lead: '',
        salesRep: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
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
      if (selectedContact) { // Condition should still work if selectedContact is correctly set
        // console.log("selectedContact:", selectedContact);
        const contactIdToUpdate = selectedContact._id; // <--- Explicitly access _id from selectedContact state
        console.log("Updating contact ID:", contactIdToUpdate); // Log the ID we are about to use
        await contactsAPI.updateContact(contactIdToUpdate, formData); // Use contactIdToUpdate
      } else {
        await contactsAPI.createContact(formData);
      }
      await loadContacts();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };
  

  if (!currentUser) {
    return <div>Loading...</div>; // Show a loading indicator until current user data is available
  }


  
  return (
    <div>
      <h1>Contact Management</h1>

      {currentUser.role !== 'SalesRep' && ( // Restrict "Add Contact" to Admins/Sales Managers
        <Button onClick={() => handleShowModal()} disabled={loading}>
          Add New Contact
        </Button>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{`${contact.firstName} ${contact.lastName}`}</td>
              <td>{contact.email}</td>
              <td>{contact.phoneNumber}</td>
              <td>{contact.company}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(contact)}
                  disabled={loading || currentUser.role === 'Sales Rep'} // Prevent Sales Reps from editing
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedContact ? 'Edit Contact' : 'Add New Contact'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* First Name */}
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Last Name */}
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Phone Number */}
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Lead Dropdown */}
            <Form.Group>
              <Form.Label>Lead</Form.Label>
              <Form.Control
                as="select"
                name="lead"
                value={formData.lead}
                onChange={handleChange}
              >
                <option value="">Select Lead</option>
                {leads.map((lead) => (
                  <option key={lead._id} value={lead._id}> {/* Use lead._id for key and value */}
                    {lead.leadName} {/* Use lead.leadName to display the lead name */}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Sales Rep Dropdown */}
            <Form.Group>
              <Form.Label>Sales Rep</Form.Label>
              <Form.Control
                as="select"
                name="salesRep"
                value={formData.salesRep}
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

            {/* Notes */}
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" disabled={loading}>
              {selectedContact ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ContactManagement;
