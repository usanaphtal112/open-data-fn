import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './SchoolCreationForm.module.css';

const AdmissionPolicyForm = ({ formData, updateFormData, schools, selectedSchool, setSelectedSchool, errors }) => {
  // Handle school selection
  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    updateFormData({
      admission_policy: {
        ...formData.admission_policy,
        [name]: value
      }
    });
  };

  return (
    <div className={styles.formSection}>
      <h4 className={styles.sectionTitle}>Admission Policy</h4>
      
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
        <Form.Label>Admission Policy <span className="text-danger">*</span></Form.Label>
        <Form.Select
          name="admission_policy"
          value={formData.admission_policy?.admission_policy || ''}
          onChange={handleChange}
          isInvalid={!!errors.admission_policy}
        >
          <option value="">-- Select Policy --</option>
          <option value="OPEN">Open Admission</option>
          <option value="SELECTIVE">Selective Admission</option>
          <option value="COMPETITIVE">Competitive Admission</option>
          <option value="OTHER">Other</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.admission_policy}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Select the school's approach to admitting new students.
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Discipline Policy <span className="text-danger">*</span></Form.Label>
        <Form.Select
          name="discipline_policy"
          value={formData.admission_policy?.discipline_policy || ''}
          onChange={handleChange}
          isInvalid={!!errors.discipline_policy}
        >
          <option value="">-- Select Policy --</option>
          <option value="STRICT">Strict</option>
          <option value="MODERATE">Moderate</option>
          <option value="PROGRESSIVE">Progressive</option>
          <option value="OTHER">Other</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.discipline_policy}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Select the school's approach to student discipline.
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Parental Engagement Policy</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="parental_engagement"
          value={formData.admission_policy?.parental_engagement || ''}
          onChange={handleChange}
          isInvalid={!!errors.parental_engagement}
          placeholder="Describe how parents are expected to be involved in their child's education..."
        />
        <Form.Control.Feedback type="invalid">
          {errors.parental_engagement}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Describe how the school engages with parents and expectations for parental involvement.
        </Form.Text>
      </Form.Group>
      
      <p className="text-muted mt-3">
        <small>Note: You can skip this step if this information is not currently available.</small>
      </p>
    </div>
  );
};

export default AdmissionPolicyForm;