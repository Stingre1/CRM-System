import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';
import { authAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Sales Rep'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(5); // 5 seconds countdown
  const [isRedirecting, setIsRedirecting] = useState(false); // Control graying out of form
  const navigate = useNavigate();

  const roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Sales Manager', label: 'Sales Manager' },
    { value: 'Sales Rep', label: 'Sales Rep' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setCountdown(5);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      setSuccessMessage('Registration successful! You will be redirected to the login page in a few seconds.');
      setToken(data.token);
      
      setIsRedirecting(true);
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval);
            navigate('/login');
          }
          return prevCountdown - 1;
        });
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '450px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Register for CRM</Card.Title>
          {
            error &&
            <Alert variant="danger">{error}</Alert>
          }
          
          {
            successMessage && 
            (<Alert variant="success" className="text-center"> {successMessage} Redirecting in {countdown} seconds... </Alert>)
          }

          {/* If redirecting, disable form and gray it out */}
          {!isRedirecting ? (
            <Form onSubmit={handleSubmit}>
              {/* name field */}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading || isRedirecting}
                />
              </Form.Group>

              {/* email field */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading || isRedirecting}
                />
              </Form.Group>

              {/* role drop-down */}
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={isLoading || isRedirecting}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* password field */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading || isRedirecting}
                />
              </Form.Group>

              {/* confirm password field */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading || isRedirecting}
                />
              </Form.Group>

              {/* submit button */}
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={isLoading || isRedirecting}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
              
              <div className="text-center">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </Form>
          ) : (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
              <p>Redirecting...</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;
