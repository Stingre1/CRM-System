import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Reports() {
  const [report, setReport] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get('/api/reports');
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <div className="mt-5">
      <h2>Reports</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {report.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {currentUser.role === 'Sales Rep' && (
        <p>Note: This report shows only your assigned leads.</p>
      )}
      {currentUser.role === 'Sales Manager' && (
        <p>Note: This report shows leads for your entire team.</p>
      )}
    </div>
  );
}

export default Reports;

