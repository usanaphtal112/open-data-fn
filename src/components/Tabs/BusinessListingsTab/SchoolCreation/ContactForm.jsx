import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import { BsPhone, BsWhatsapp, BsEnvelope, BsGlobe, BsTwitter, BsYoutube, BsFacebook, BsLinkedin, BsInstagram } from 'react-icons/bs';

const ContactForm = ({ 
  formData, 
  updateFormData, 
  schools, 
  selectedSchool, 
  setSelectedSchool, 
  errors = {}, 
  isEditMode = false 
}) => {
  const [contactData, setContactData] = useState({
    phone_number: '',
    whatsapp: '',
    email: '',
    website: '',
    social_media: {
      twitter: '',
      youtube: '',
      facebook: '',
      linkedin: '',
      instagram: ''
    }
  });

  useEffect(() => {
    // Initialize form with existing data if available
    if (formData && formData.contact) {
      setContactData({
        phone_number: formData.contact.phone_number || '',
        whatsapp: formData.contact.whatsapp || '',
        email: formData.contact.email || '',
        website: formData.contact.website || '',
        social_media: {
          twitter: formData.contact.social_media?.twitter || '',
          youtube: formData.contact.social_media?.youtube || '',
          facebook: formData.contact.social_media?.facebook || '',
          linkedin: formData.contact.social_media?.linkedin || '',
          instagram: formData.contact.social_media?.instagram || ''
        }
      });
    }
  }, [formData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Update parent component state
    updateFormData({
      contact: {
        ...formData.contact,
        [name]: value
      }
    });
  };

  // Handle social media field changes
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setContactData(prevState => ({
      ...prevState,
      social_media: {
        ...prevState.social_media,
        [name]: value
      }
    }));
    
    // Update parent component state
    updateFormData({
      contact: {
        ...formData.contact,
        social_media: {
          ...formData.contact?.social_media,
          [name]: value
        }
      }
    });
  };

  // Handle school selection
  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setSelectedSchool(schoolId);
  };

  return (
    <div>
      <h4 className="mb-4">School Contact Information</h4>
      
      {!isEditMode && schools && schools.length > 0 && (
        <Form.Group className="mb-4">
          <Form.Label>Select School</Form.Label>
          <Form.Select
            value={selectedSchool}
            onChange={handleSchoolChange}
            isInvalid={errors.school}
          >
            <option value="">Select a school</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>
                {school.school_name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.school}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Select the school you want to add contact information for
          </Form.Text>
        </Form.Group>
      )}
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsPhone /></InputGroup.Text>
              <Form.Control
                type="text"
                name="phone_number"
                value={contactData.phone_number}
                onChange={handleChange}
                placeholder="e.g. +250 785 123 456"
                isInvalid={errors.phone_number}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone_number}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>WhatsApp</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsWhatsapp /></InputGroup.Text>
              <Form.Control
                type="text"
                name="whatsapp"
                value={contactData.whatsapp}
                onChange={handleChange}
                placeholder="e.g. +250 785 123 456"
                isInvalid={errors.whatsapp}
              />
              <Form.Control.Feedback type="invalid">
                {errors.whatsapp}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                value={contactData.email}
                onChange={handleChange}
                placeholder="e.g. info@school.com"
                isInvalid={errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Website</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsGlobe /></InputGroup.Text>
              <Form.Control
                type="url"
                name="website"
                value={contactData.website}
                onChange={handleChange}
                placeholder="e.g. https://www.school.com"
                isInvalid={errors.website}
              />
              <Form.Control.Feedback type="invalid">
                {errors.website}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <h5 className="mt-4 mb-3">Social Media Links</h5>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Twitter</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsTwitter /></InputGroup.Text>
              <Form.Control
                type="url"
                name="twitter"
                value={contactData.social_media.twitter}
                onChange={handleSocialMediaChange}
                placeholder="e.g. https://twitter.com/schoolname"
                isInvalid={errors.social_media?.twitter}
              />
              <Form.Control.Feedback type="invalid">
                {errors.social_media?.twitter}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>YouTube</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsYoutube /></InputGroup.Text>
              <Form.Control
                type="url"
                name="youtube"
                value={contactData.social_media.youtube}
                onChange={handleSocialMediaChange}
                placeholder="e.g. https://youtube.com/schoolname"
                isInvalid={errors.social_media?.youtube}
              />
              <Form.Control.Feedback type="invalid">
                {errors.social_media?.youtube}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Facebook</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsFacebook /></InputGroup.Text>
              <Form.Control
                type="url"
                name="facebook"
                value={contactData.social_media.facebook}
                onChange={handleSocialMediaChange}
                placeholder="e.g. https://facebook.com/schoolname"
                isInvalid={errors.social_media?.facebook}
              />
              <Form.Control.Feedback type="invalid">
                {errors.social_media?.facebook}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>LinkedIn</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsLinkedin /></InputGroup.Text>
              <Form.Control
                type="url"
                name="linkedin"
                value={contactData.social_media.linkedin}
                onChange={handleSocialMediaChange}
                placeholder="e.g. https://linkedin.com/schoolname"
                isInvalid={errors.social_media?.linkedin}
              />
              <Form.Control.Feedback type="invalid">
                {errors.social_media?.linkedin}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Instagram</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsInstagram /></InputGroup.Text>
              <Form.Control
                type="url"
                name="instagram"
                value={contactData.social_media.instagram}
                onChange={handleSocialMediaChange}
                placeholder="e.g. https://instagram.com/schoolname"
                isInvalid={errors.social_media?.instagram}
              />
              <Form.Control.Feedback type="invalid">
                {errors.social_media?.instagram}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default ContactForm;