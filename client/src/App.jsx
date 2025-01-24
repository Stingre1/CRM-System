import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import ContactManagement from './pages/ContactManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isAuthenticated } from './utils/auth';



function App() {
  return (
    
    <Router>
      <Navigation />
      <Container className="py-4 d-flex justify-content-center align-items-center">
        <Routes>
          {/* for when we wanna make our entry point the Homepage */}
          {/* <Route path="/" element={<Homepage />} /> */}
          {/* rn we're starting at the login page */}
          
          <Route path="/login" element={
              <Login />
          } />
          
          <Route path="/register" element={
              <Register />
          } />
          
          
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/leads" element={
            <PrivateRoute>
              <LeadManagement />
            </PrivateRoute>
          } />

          <Route path="/contacts" element={
            <PrivateRoute>
              <ContactManagement />
            </PrivateRoute>
          } />
          
          <Route path="/users" element={
            <PrivateRoute requiredRole="admin">
              <UserManagement />
            </PrivateRoute>
          } />
          
          <Route path="/reports" element={
            <PrivateRoute requiredRole="manager">
              <Reports />
            </PrivateRoute>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;