import React, { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import styles from './SchoolCreationForm.module.css';

const BasicInfoForm = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formSectionTitle}>Basic School Information</h3>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="school_code">
            <Form.Label>School Code*</Form.Label>
            <Form.Control
              type="number"
              name="school_code"
              value={formData.school_code}
              onChange={handleChange}
              placeholder="Enter numeric school code"
              required
            />
            <Form.Text className="text-muted">
              Enter the official school identification code
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="school_name">
            <Form.Label>School Name*</Form.Label>
            <Form.Control
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              placeholder="Enter school name"
              required
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="school_type">
            <Form.Label>School Type*</Form.Label>
            <Form.Select
              name="school_type"
              value={formData.school_type}
              onChange={handleChange}
              required
            >
              <option value="">Select school type</option>
              <option value="BOARDING">Boarding</option>
              <option value="DAY">Day</option>
              <option value="BOTH">Boarding and Day</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="school_level">
            <Form.Label>School Level*</Form.Label>
            <Form.Select
              name="school_level"
              value={formData.school_level}
              onChange={handleChange}
              required
            >
              <option value="">Select school level</option>
              <option value="KINDERGARTEN">Kindergarten</option>
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
              <option value="COMBINED">Combined</option>
              <option value="TVET">TVET</option>
              <option value="TERTIARY">Tertiary Institution</option>
              <option value="COLLEGE">Collage</option>
              <option value="INSTITUTE">Institute</option>
              <option value="UNIVERSITY">University</option>
              <option value="OTHER">Other</option>
              
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="school_gender">
            <Form.Label>Gender*</Form.Label>
            <Form.Select
              name="school_gender"
              value={formData.school_gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender type</option>
              <option value="M">Boys Only</option>
              <option value="F">Girls Only</option>
              <option value="MF">Mixed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="school_ownership">
            <Form.Label>Ownership*</Form.Label>
            <Form.Select
              name="school_ownership"
              value={formData.school_ownership}
              onChange={handleChange}
              required
            >
              <option value="">Select ownership type</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="GOVT_AIDED">Government Aided</option>
              <option value="RELIGIOUS">ReligiousInstitution</option>
              <option value="INTERNATIONAL">Internation School</option>
              <option value="OTHER">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="school_description">
            <Form.Label>Description*</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="school_description"
              value={formData.school_description}
              onChange={handleChange}
              placeholder="Enter a detailed description of the school"
              required
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default BasicInfoForm;