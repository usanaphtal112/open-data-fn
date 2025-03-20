import React from 'react';
import { Container, Card, Row, Col, Placeholder, Tabs, Tab } from 'react-bootstrap';

const SchoolDetailSkeleton = () => {
  return (
    <Container className="my-4 school-detail-container">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Placeholder.Button variant="secondary" xs={2} />
      </div>

      {/* Header Skeleton */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} size="lg" />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={3} /> <Placeholder xs={2} />
              </Placeholder>
              <div className="school-badges mb-3">
                <Placeholder.Button variant="primary" xs={1} className="me-2" />
                <Placeholder.Button variant="info" xs={1} className="me-2" />
                <Placeholder.Button variant="dark" xs={1} />
              </div>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} />
              </Placeholder>
            </Col>
            <Col md={4}>
              <div className="p-3 bg-light rounded">
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={4} /> <Placeholder xs={3} />
                </Placeholder>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={5} />
                </Placeholder>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Carousel Skeleton */}
      <div className="mb-4">
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div style={{ height: '400px', backgroundColor: '#e9ecef', borderRadius: '8px' }}></div>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultActiveKey="overview" className="mb-4">
        <Tab eventKey="overview" title="Overview">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={3} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={8} />
                <Placeholder xs={12} /> <Placeholder xs={10} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="admission" title="Admission" disabled></Tab>
        <Tab eventKey="contact" title="Contact" disabled></Tab>
        <Tab eventKey="alumni" title="Alumni" disabled></Tab>
      </Tabs>
    </Container>
  );
};

export default SchoolDetailSkeleton;