import { Card, Row, Col } from 'react-bootstrap';

function Reports() {
  return (
    <div>
      <h1 className="mb-4">Reports</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Sales Performance</Card.Title>
              <Card.Text>
                Sales performance data will be displayed here
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Lead Conversion</Card.Title>
              <Card.Text>
                Lead conversion metrics will be displayed here
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Trends</Card.Title>
              <Card.Text>
                Monthly trend data will be displayed here
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Reports;