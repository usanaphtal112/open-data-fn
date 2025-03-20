import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import styles from './SchoolCreationForm.module.css';

const FeesForm = ({ formData, updateFormData, schools, selectedSchool, setSelectedSchool, errors }) => {
  const [fees, setFees] = useState(
    formData.fees || [{ currency: '', amount: '' }]
  );

  // Handle school selection
  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  // Handle fee changes
  const handleFeeChange = (index, field, value) => {
    const updatedFees = [...fees];
    updatedFees[index] = { ...updatedFees[index], [field]: value };
    
    setFees(updatedFees);
    
    updateFormData({
      fees: updatedFees
    });
  };

  // Add new fee
  const addFee = () => {
    const updatedFees = [...fees, { currency: '', amount: '' }];
    setFees(updatedFees);
    
    updateFormData({
      fees: updatedFees
    });
  };

  // Remove fee
  const removeFee = (index) => {
    if (fees.length > 1) {
      const updatedFees = fees.filter((_, i) => i !== index);
      setFees(updatedFees);
      
      updateFormData({
        fees: updatedFees
      });
    }
  };

  return (
    <div className={styles.formSection}>
      <h4 className={styles.sectionTitle}>School Fees</h4>
      
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
      
      <div className={styles.subsection}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className={styles.subsectionTitle}>Fee Structure</h5>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={addFee}
            className="d-flex align-items-center"
          >
            <BsPlusCircle className="me-1" /> Add Fee
          </Button>
        </div>
        
        {fees.map((fee, index) => (
          <Row key={index} className="mb-3 align-items-center">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  value={fee.currency}
                  onChange={(e) => handleFeeChange(index, 'currency', e.target.value)}
                  isInvalid={errors[`currency_${index}`]}
                >
                  <option value="">-- Select Currency --</option>
                  <option value="RWF">Rwandan Franc (RWF)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors[`currency_${index}`]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={5}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  value={fee.amount}
                  onChange={(e) => handleFeeChange(index, 'amount', e.target.value)}
                  isInvalid={errors[`amount_${index}`]}
                  placeholder="e.g., 50000, 100000"
                />
                <Form.Control.Feedback type="invalid">
                  {errors[`amount_${index}`]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={2} className="d-flex align-items-end justify-content-center">
              {fees.length > 1 && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => removeFee(index)}
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

export default FeesForm;