import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const SchoolPreviewCard = ({ school }) => {
  // Use the theme hook to access current theme
  const { theme } = useTheme();

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
    return code;
  };

  // Custom styles using CSS variables
  const cardHeaderStyle = {
    backgroundColor: 'var(--accent-color)',
    color: 'var(--button-text)'
  };

  const cardBodyStyle = {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)'
  };

  const cardFooterStyle = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)'
  };

  const badgePrimaryStyle = {
    backgroundColor: 'var(--accent-color)',
    color: 'var(--button-text)'
  };

  const badgeSecondaryStyle = {
    backgroundColor: 'var(--text-secondary)',
    color: 'var(--button-text)'
  };

  return (
    <Card className="school-preview-card border-0 shadow">
      <Card.Header style={cardHeaderStyle}>
        <h5 className="mb-0">{school.school_name}</h5>
      </Card.Header>
      <Card.Body style={cardBodyStyle}>
        <div className="mb-2">
          <span 
            className="badge me-2" 
            style={badgePrimaryStyle}
          >
            {getReadableValue(school.school_type, 'type')}
          </span>
          <span 
            className="badge" 
            style={badgeSecondaryStyle}
          >
            {getReadableValue(school.school_level, 'level')}
          </span>
        </div>
        
        {school.location && (
          <div className="mb-2 d-flex align-items-center">
            <FaMapMarkerAlt style={{ color: 'var(--accent-color-dark)' }} className="me-2" />
            <small>{school.location.address || "Location information available in details"}</small>
          </div>
        )}
        
        {school.phone && (
          <div className="mb-2 d-flex align-items-center">
            <FaPhone style={{ color: 'var(--accent-color)' }} className="me-2" />
            <small>{school.phone}</small>
          </div>
        )}
        
        <div className="mt-3 text-center">
          <div className="ratings mb-2">
            <span style={{ color: '#FFD700' }}>★</span> {school.average_rating} 
            <small style={{ color: 'var(--text-secondary)' }} className="ms-2">
              ({school.review_count || "N/A"} reviews)
            </small>
          </div>
        </div>
      </Card.Body>
      <Card.Footer style={cardFooterStyle}>
        <small>Click for full details</small>
      </Card.Footer>
    </Card>
  );
};

export default SchoolPreviewCard;