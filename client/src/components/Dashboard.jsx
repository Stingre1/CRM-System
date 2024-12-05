import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="mt-5">
      <h2>Welcome, {currentUser.username}!</h2>
      <p>Role: {currentUser.role}</p>
      <p>Here you can see an overview of your CRM activities.</p>
      {/* Add more dashboard content here */}
    </div>
  );
}

export default Dashboard;

