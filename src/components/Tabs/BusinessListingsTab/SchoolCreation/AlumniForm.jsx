import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { BsTrash, BsPlus } from 'react-icons/bs';
import styles from './SchoolCreationForm.module.css';

const AlumniForm = ({ formData, updateFormData }) => {
  // Add a new alumni entry
  const addAlumni = () => {
    const updatedAlumni = [...formData.notable_alumni, { name: '', achievement: '' }];
    updateFormData({ notable_alumni: updatedAlumni });
  };

  // Remove an alumni entry
  const removeAlumni = (index) => {
    const updatedAlumni = formData.notable_alumni.filter((_, i) => i !== index);
    updateFormData({ notable_alumni: updatedAlumni });
  };

  // Handle alumni data changes
  const handleAlumniChange = (index, field, value) => {
    const updatedAlumni = [...formData.notable_alumni];
    updatedAlumni[index] = {
      ...updatedAlumni[index],
      [field]: value
    };
    updateFormData({ notable_alumni: updatedAlumni });
  };

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formSectionTitle}>Notable Alumni</h3>
      <p className="text-muted mb-4">
        Add information about notable alumni from this school. This is optional but helps highlight 
        the school's achievements and legacy.
      </p>
      
      {formData.notable_alumni.map((alumni, index) => (
        <Row key={index} className="mb-3 align-items-end">
          <Col md={5}>
            <Form.Group controlId={`alumni-name-${index}`}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={alumni.name}
                onChange={(e) => handleAlumniChange(index, 'name', e.target.value)}
                placeholder="Enter alumni name"
              />
            </Form.Group>
          </Col>
          
          <Col md={5}>
            <Form.Group controlId={`alumni-achievement-${index}`}>
              <Form.Label>Achievement</Form.Label>
              <Form.Control
                type="text"
                value={alumni.achievement}
                onChange={(e) => handleAlumniChange(index, 'achievement', e.target.value)}
                placeholder="Enter notable achievement"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Button 
              variant="outline-danger"
              onClick={() => removeAlumni(index)}
              disabled={formData.notable_alumni.length === 1}
              className="w-100"
            >
              <BsTrash />
            </Button>
          </Col>
        </Row>
      ))}
      
      <Button 
        variant="outline-primary" 
        onClick={addAlumni} 
        className="mt-2 d-flex align-items-center"
      >
        <BsPlus className="me-1" /> Add Another Alumni
      </Button>
      
      <div className="mt-4 alert alert-info">
        <small>
          You can add more details about the school (contacts, admission policy, etc.) 
          after creating the basic profile.
        </small>
      </div>
    </div>
  );
};

export default AlumniForm;