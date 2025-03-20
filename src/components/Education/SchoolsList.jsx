import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Form, InputGroup, Button, Alert, Placeholder } from 'react-bootstrap';
import educationService from '../../services/resources/educationService';
import SchoolsLoadingSkeleton from './SchoolsLoadingSkeleton';
import SchoolPreviewCard from './SchoolPreviewCard';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './SchoolList.module.css';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    schoolType: '',
    schoolLevel: '',
    schoolOwnership: '',
  });

  const [hoveredSchool, setHoveredSchool] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const previewRef = useRef(null);
  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const data = await educationService.getSchools();
        setSchools(data);
        setFilteredSchools(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load schools. Please try again later.');
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = schools;

    // Apply search term
    if (searchTerm) {
      result = result.filter(school => 
        school.school_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply dropdown filters
    if (filters.schoolType) {
      result = result.filter(school => school.school_type === filters.schoolType);
    }
    if (filters.schoolLevel) {
      result = result.filter(school => school.school_level === filters.schoolLevel);
    }
    if (filters.schoolOwnership) {
      result = result.filter(school => school.school_ownership === filters.schoolOwnership);
    }

    setFilteredSchools(result);
  }, [searchTerm, filters, schools]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      schoolType: '',
      schoolLevel: '',
      schoolOwnership: '',
    });
  };

  // Helper to get readable values from codes
  const getReadableValue = (code, type) => {
    if (type === 'type') {
      return code === 'BOTH' ? 'Day & Boarding' : code;
    }
    if (type === 'level') {
      switch(code) {
        case 'PRIMARY': return 'Primary';
        case 'SECONDARY': return 'Secondary';
        case 'COMBINED': return 'Combined';
        default: return code;
      }
    }
    if (type === 'ownership') {
      switch(code) {
        case 'GOVT_AIDED': return 'Government Aided';
        case 'INTERNATIONAL': return 'International';
        default: return code;
      }
    }
    if (type === 'gender') {
      switch(code) {
        case 'MF': return 'Mixed';
        case 'M': return 'Boys';
        case 'F': return 'Girls';
        default: return code;
      }
    }
    return code;
  };

  // Helper to get verification badge
  const getVerificationBadge = (verified) => {
    return verified ? 
      <Badge bg="success">Verified</Badge> : 
      <Badge bg="secondary">Unverified</Badge>;
  };

  const handleMouseEnter = (school, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Position to the right of the card
    setPreviewPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 20 // 20px offset from the card
    });
    setHoveredSchool(school);
  };

  const handleMouseLeave = () => {
    setHoveredSchool(null);
  };

  if (loading) {
    return (
      <div className={`${styles.schoolsListContainer} my-4 ${theme === 'dark' ? styles.darkMode : ''}`}>
        <h2 className="mb-4">Rwanda Schools Directory</h2>
        <div className="filters-section mb-4">
          <Row>
            <Col md={6} lg={4} className="mb-3">
              <Placeholder as={Form.Control} animation="glow" />
            </Col>
            <Col md={6} lg={8}>
              <Row>
                <Col sm={4} className="mb-3">
                  <Placeholder as={Form.Select} animation="glow" />
                </Col>
                <Col sm={4} className="mb-3">
                  <Placeholder as={Form.Select} animation="glow" />
                </Col>
                <Col sm={4} className="mb-3">
                  <Placeholder as={Form.Select} animation="glow" />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <SchoolsLoadingSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className={`${styles.schoolsListContainer} my-4 ${theme === 'dark' ? styles.darkMode : ''}`}>
      <h2 className="mb-4">Rwanda Schools Directory</h2>
      
      {/* Search and Filters */}
      <div className="filters-section mb-4">
        <Row>
          <Col md={6} lg={4} className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <Button variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'} onClick={() => setSearchTerm('')}>
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={6} lg={8}>
            <Row>
              <Col sm={4} className="mb-3">
                <Form.Select 
                  name="schoolType" 
                  value={filters.schoolType}
                  onChange={handleFilterChange}
                  aria-label="Filter by school type"
                  className={styles.selectFilter}
                >
                  <option value="">All School Types</option>
                  <option value="BOTH">Day & Boarding</option>
                  <option value="DAY">Day School</option>
                  <option value="BOARDING">Boarding School</option>
                </Form.Select>
              </Col>
              <Col sm={4} className="mb-3">
                <Form.Select 
                  name="schoolLevel" 
                  value={filters.schoolLevel}
                  onChange={handleFilterChange}
                  aria-label="Filter by school level"
                  className={styles.selectFilter}
                >
                  <option value="">All School Levels</option>
                  <option value="PRIMARY">Primary</option>
                  <option value="SECONDARY">Secondary</option>
                  <option value="COMBINED">Combined</option>
                </Form.Select>
              </Col>
              <Col sm={4} className="mb-3">
                <Form.Select 
                  name="schoolOwnership" 
                  value={filters.schoolOwnership}
                  onChange={handleFilterChange}
                  aria-label="Filter by ownership"
                  className={styles.selectFilter}
                >
                  <option value="">All Ownership Types</option>
                  <option value="GOVT_AIDED">Government Aided</option>
                  <option value="PRIVATE">Private</option>
                  <option value="INTERNATIONAL">International</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
        
        {/* Clear filters button */}
        {(searchTerm || filters.schoolType || filters.schoolLevel || filters.schoolOwnership) && (
          <Button 
            variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'} 
            size="sm" 
            onClick={clearFilters} 
            className="mt-2"
          >
            Clear All Filters
          </Button>
        )}
        
        <div className="mt-3">
          <small className={theme === 'dark' ? styles.textMuted : 'text-muted'}>
            Showing {filteredSchools.length} of {schools.length} schools
          </small>
        </div>
      </div>
      
      {/* Schools Grid */}
      <Row>
        {filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <Col key={school.id} lg={4} md={6} className="mb-4">
              <Card 
                key={school.id} 
                className={`${styles.schoolCard} ${theme === 'dark' ? styles.darkCard : ''}`}
                onMouseEnter={(e) => handleMouseEnter(school, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={styles.cardImgContainer}>
                  {school.cover ? (
                    <Card.Img 
                      variant="top" 
                      src={`${school.cover}`} 
                      alt={school.school_name}
                      className="img-fluid"
                      style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  ) : (
                    <div className={`d-flex align-items-center justify-content-center ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`} style={{ height: '100%' }}>
                      <span className={theme === 'dark' ? styles.textMuted : 'text-muted'}>No Image Available</span>
                    </div>
                  )}
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className={theme === 'dark' ? styles.cardTitle : ''}>{school.school_name}</Card.Title>
                    {getVerificationBadge(school.verified)}
                  </div>
                  
                  <div className={styles.schoolBadges}>
                    <Badge bg="info" className="me-2">{getReadableValue(school.school_type, 'type')}</Badge>
                    <Badge bg="primary" className="me-2">{getReadableValue(school.school_level, 'level')}</Badge>
                    <Badge bg="dark">{getReadableValue(school.school_gender, 'gender')}</Badge>
                  </div>
                  
                  <div className="mb-3">
                    <small className={theme === 'dark' ? styles.textMuted : 'text-muted'}>School Code: {school.school_code}</small>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="ratings">
                      <span className="text-warning">★</span> {school.average_rating} 
                    </div>
                    <Link to={`/schools-colleges/${school.id}`} className={`btn btn-sm ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'}`}>
                      View Details
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant={theme === 'dark' ? 'dark' : 'info'}>
              No schools match your search criteria. Try adjusting your filters.
            </Alert>
          </Col>
        )}
      </Row>
      {hoveredSchool && (
        <div 
          ref={previewRef}
          className={`${styles.schoolPreviewContainer} ${theme === 'dark' ? styles.darkPreview : ''}`} 
          style={{ 
            top: `${previewPosition.top}px`, 
            left: `${previewPosition.left}px`,
            display: window.innerWidth > 768 ? 'block' : 'none' // Only show on larger screens
          }}
        >
          <SchoolPreviewCard school={hoveredSchool} />
        </div>
      )}
    </div>
  );
};

export default SchoolsList;