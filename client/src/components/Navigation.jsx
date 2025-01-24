import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, removeToken } from '../utils/auth';
const currentPath = window.location.pathname;

function Navigation() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // if(authenticated && currentPath == '/login') {
  //   // navigate('/');
  //   removeToken();
  //   return null;
  // }

  if (!authenticated) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">RHCP CRM Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/leads">Leads</Nav.Link>
            <Nav.Link as={Link} to="/contacts">Contacts</Nav.Link>
            {userRole === 'Admin' && (
              <Nav.Link as={Link} to="/users">Users</Nav.Link>
            )}
            {(userRole === 'Admin' || userRole === 'Sales Manager') && (
              
              <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
            )}
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;