import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

function LeadManagement() {
  const [leads] = useState([]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lead Management</h1>
        <Button variant="primary">Add New Lead</Button>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No leads found</td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.company}</td>
                <td>{lead.email}</td>
                <td>{lead.status}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                  <Button variant="outline-danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default LeadManagement;