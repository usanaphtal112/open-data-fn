import React from 'react';
import { Row, Col, Card, Placeholder } from 'react-bootstrap';

const SchoolsLoadingSkeleton = ({ count = 6 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Col key={index} lg={4} md={6} className="mb-4">
      <Card className="h-100 school-card">
        <div className="card-img-container" style={{ height: '180px', backgroundColor: '#e9ecef' }}></div>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
          <div className="school-badges mb-3">
            <Placeholder.Button variant="primary" xs={2} className="me-2" />
            <Placeholder.Button variant="info" xs={2} className="me-2" />
            <Placeholder.Button variant="dark" xs={2} />
          </div>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={5} /> <Placeholder xs={4} />
          </Placeholder>
          <div className="d-flex justify-content-between align-items-center">
            <Placeholder.Button variant="warning" xs={3} />
            <Placeholder.Button variant="primary" xs={4} />
          </div>
        </Card.Body>
      </Card>
    </Col>
  ));

  return <Row>{skeletons}</Row>;
};

export default SchoolsLoadingSkeleton;