import { Card, Row, Col } from 'react-bootstrap';
import { getUserRole } from '../utils/auth';

function Dashboard() {
  const userRole = getUserRole();

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Active Leads</Card.Title>
              <Card.Text className="h2">0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Conversion Rate</Card.Title>
              <Card.Text className="h2">0%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text className="h2">$0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Card.Title>Welcome!</Card.Title>
          <Card.Text>
            You are logged in as: {userRole}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;