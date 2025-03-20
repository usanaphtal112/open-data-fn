import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import styles from './SchoolCreationForm.module.css';

const GovernmentDataForm = ({ formData, updateFormData, schools, selectedSchool, setSelectedSchool, errors }) => {
  const [inspectionRecords, setInspectionRecords] = useState(
    formData.government_data?.inspection_record || [{ date: '', result: '' }]
  );

  // Handle school selection
  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'government_supported') {
      updateFormData({
        government_data: {
          ...formData.government_data,
          government_supported: checked
        }
      });
    } else {
      updateFormData({
        government_data: {
          ...formData.government_data,
          [name]: value
        }
      });
    }
  };

  // Handle inspection record changes
  const handleInspectionChange = (index, field, value) => {
    const updatedRecords = [...inspectionRecords];
    updatedRecords[index] = { ...updatedRecords[index], [field]: value };
    
    setInspectionRecords(updatedRecords);
    
    updateFormData({
      government_data: {
        ...formData.government_data,
        inspection_record: updatedRecords
      }
    });
  };

  // Add new inspection record
  const addInspectionRecord = () => {
    const updatedRecords = [...inspectionRecords, { date: '', result: '' }];
    setInspectionRecords(updatedRecords);
    
    updateFormData({
      government_data: {
        ...formData.government_data,
        inspection_record: updatedRecords
      }
    });
  };

  // Remove inspection record
  const removeInspectionRecord = (index) => {
    if (inspectionRecords.length > 1) {
      const updatedRecords = inspectionRecords.filter((_, i) => i !== index);
      setInspectionRecords(updatedRecords);
      
      updateFormData({
        government_data: {
          ...formData.government_data,
          inspection_record: updatedRecords
        }
      });
    }
  };

  return (
    <div className={styles.formSection}>
      <h4 className={styles.sectionTitle}>Government Data</h4>
      
      <Form.Group className="mb-4">
        <Form.Label>Select School <span className="text-danger">*</span></Form.Label>
        <Form.Select
          value={selectedSchool}
          onChange={handleSchoolChange}
          isInvalid={!!errors.school}
        >
          <option value="">-- Select School --</option>
          {schools.map(school => (
            <option key={school.id} value={school.id}>
              {school.school_name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.school}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Check
          type="checkbox"
          id="government_supported"
          name="government_supported"
          label="Government Supported"
          checked={formData.government_data?.government_supported || false}
          onChange={handleChange}
        />
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Registration Date</Form.Label>
        <Form.Control
          type="date"
          name="registration_date"
          value={formData.government_data?.registration_date || ''}
          onChange={handleChange}
          isInvalid={!!errors.registration_date}
        />
        <Form.Control.Feedback type="invalid">
          {errors.registration_date}
        </Form.Control.Feedback>
      </Form.Group>
      
      <div className={styles.subsection}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className={styles.subsectionTitle}>Inspection Records</h5>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={addInspectionRecord}
            className="d-flex align-items-center"
          >
            <BsPlusCircle className="me-1" /> Add Record
          </Button>
        </div>
        
        {inspectionRecords.map((record, index) => (
          <Row key={index} className="mb-3 align-items-center">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={record.date}
                  onChange={(e) => handleInspectionChange(index, 'date', e.target.value)}
                  isInvalid={errors[`inspection_date_${index}`]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors[`inspection_date_${index}`]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={5}>
              <Form.Group>
                <Form.Label>Result</Form.Label>
                <Form.Control
                  type="text"
                  value={record.result}
                  onChange={(e) => handleInspectionChange(index, 'result', e.target.value)}
                  isInvalid={errors[`inspection_result_${index}`]}
                  placeholder="e.g., Compliant, Needs Improvement"
                />
                <Form.Control.Feedback type="invalid">
                  {errors[`inspection_result_${index}`]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={2} className="d-flex align-items-end justify-content-center">
              {inspectionRecords.length > 1 && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => removeInspectionRecord(index)}
                  className="mt-2"
                >
                  <BsTrash />
                </Button>
              )}
            </Col>
          </Row>
        ))}
      </div>
      
      <p className="text-muted mt-3">
        <small>Note: You can skip this step if this information is not currently available.</small>
      </p>
    </div>
  );
};

export default GovernmentDataForm;