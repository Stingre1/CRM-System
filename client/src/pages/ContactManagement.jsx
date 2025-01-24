import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { contactsAPI, leadsAPI, usersAPI } from '../services/api';

function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [salesReps, setSalesReps] = useState([]); // Add state to store Sales Reps
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
    salesRep: '', // Added salesRep to form data
  });

  useEffect(() => {
    loadContacts();
    loadSalesReps(); // Fetch Sales Reps when the component loads
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsAPI.getContacts();
      // console.log(data);
      if (Array.isArray(data.contacts)) {
        setContacts(data.contacts);
      } else {
        throw new Error('Contacts data is not an array');
      }    
    } catch (err) {
      console.log(`Error: ${err}`)
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const loadSalesReps = async () => {
    try {
      const data = await usersAPI.getSalesReps(); // Assuming this API call fetches sales reps
      // console.log(data);
      setSalesReps(data);
    } catch (err) {
      console.log(`${err}`);
      setError('Failed to load Sales Reps');
    }
  };

  const handleShowModal = (contact = null) => {
    if (contact) {
      setSelectedContact(contact);
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        company: contact.company,
        title: contact.title,
        notes: contact.notes,
        lead: contact.lead ? contact.lead._id : '',
        salesRep: contact.salesRep ? contact.salesRep._id : '', // If updating, assign salesRep
      });
    } else {
      setSelectedContact(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        title: '',
        notes: '',
        lead: '',
        salesRep: '', // Make sure salesRep is empty when creating a new contact
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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedContact) {
        await contactsAPI.updateContact(selectedContact.id, formData);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        await contactsAPI.deleteContact(id);
        await loadContacts();
      } catch (err) {
        setError('Failed to delete contact');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Contact Management</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Contact
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                {loading ? 'Loading contacts...' : 'No contacts found'}
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{`${contact.firstName} ${contact.lastName}`}</td>
                <td>{contact.email}</td>
                <td>{contact.phoneNumber}</td>
                <td>{contact.company}</td>
                <td>{contact.title}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(contact)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedContact ? 'Edit Contact' : 'Add New Contact'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Other form fields for email, phone, company, etc. */}

            {/* Add Lead Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Lead</Form.Label>
              <Form.Control
                as="select"
                name="lead"
                value={formData.lead}
                onChange={handleChange}
                required
              >
                <option value="">Select Lead</option>
                {/* Populate with lead options */}
              </Form.Control>
            </Form.Group>

            {/* Add Sales Rep Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Sales Rep</Form.Label>
              <Form.Control
                as="select"
                name="salesRep"
                value={formData.salesRep}
                onChange={handleChange}
                required
              >
                <option value="">Select Sales Rep</option>
                {salesReps.map((rep) => (
                  <option key={rep._id} value={rep._id}>
                    {rep.name} {/* Adjust as per your Sales Rep structure */}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Contact'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ContactManagement;
