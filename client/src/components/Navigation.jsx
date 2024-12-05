import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { currentUser, logout } = useAuth();
  const history = useNavigate();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">CRM System</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {currentUser && (
            <>
              <Nav.Link as={Link} to="/leads">Leads</Nav.Link>
              <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
              {currentUser.role === 'Admin' && (
                <Nav.Link as={Link} to="/users">Users</Nav.Link>
              )}
            </>
          )}
        </Nav>
        {currentUser ? (
          <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
        ) : (
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;

