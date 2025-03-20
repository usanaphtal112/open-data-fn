import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight, BsCheck2Circle, BsExclamationTriangle } from 'react-icons/bs';
import BasicInfoForm from './BasicInfoForm';
import LocationForm from './LocationForm';
import ContactForm from './ContactForm';
import AdmissionPolicyForm from './AdmissionPolicyForm';
import GovernmentDataForm from './GovernmentDataForm';
import FeesForm from './FeesForm';
import AlumniForm from './AlumniForm';
import ImagesUploadForm from './ImagesUploadForm';
import apiClient from '../../../../services/api/client';
import { endpoints } from '../../../../services/api/endpoints';
import styles from './SchoolCreationForm.module.css';

const SchoolCreationForm = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    school_code: '',
    school_name: '',
    school_type: '',
    school_level: '',
    school_gender: '',
    school_ownership: '',
    school_description: '',
    
    // Location
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    address: '',
    latitude: '',
    longitude: '',

    // Contact
    contact: {
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
    },
    
    // Admission Policy
    admission_policy: {
      admission_policy: '',
      discipline_policy: '',
      parental_engagement: ''
    },
    
    // Government Data
    government_data: {
      government_supported: false,
      registration_date: '',
      inspection_record: [{ date: '', result: '' }]
    },
    
    // Fees
    fees: [{ currency: '', amount: '' }],
    
    // Alumni
    notable_alumni: [{ name: '', achievement: '' }],
    
    // Images
    imageUploads: [],
    deletedImageIds: [],
    updatedExistingImages: []
  });

  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  
  // Total number of steps in the form
  const totalSteps = 8;
  
  // Fetch schools created by the user
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiClient.get(endpoints.education.userSchools);
        setSchools(response.data);
      } catch (err) {
        setErrors({ general: 'Failed to load schools. Please try again later.' });
      }
    };

    if (currentStep > 1) {
      fetchSchools();
    }
  }, [currentStep]);

  // Memoize updateFormData to prevent unnecessary re-renders
  const updateFormData = useCallback((data) => {
    setFormData(prevState => ({
      ...prevState,
      ...data
    }));
  }, []);
  
  // Parse API error responses
  const parseErrors = (errorResponse) => {
    if (errorResponse && errorResponse.data) {
      return errorResponse.data;
    }
    return { general: 'An unexpected error occurred. Please try again.' };
  };
  
  // Validation for current step
  const validateCurrentStep = () => {
    let stepErrors = {};
    
    if (currentStep === 1) {
      if (!formData.school_code) stepErrors.school_code = 'School code is required';
      if (!formData.school_name) stepErrors.school_name = 'School name is required';
      if (!formData.school_type) stepErrors.school_type = 'School type is required';
      if (!formData.school_level) stepErrors.school_level = 'School level is required';
      if (!formData.school_gender) stepErrors.school_gender = 'Gender type is required';
      if (!formData.school_ownership) stepErrors.school_ownership = 'Ownership type is required';
      if (!formData.school_description) stepErrors.school_description = 'Description is required';
    } else if (currentStep === 2) {
      if (!selectedSchool) stepErrors.school = 'Please select a school';
      if (!formData.province) stepErrors.province = 'Province is required';
      if (!formData.district) stepErrors.district = 'District is required';
      if (!formData.sector) stepErrors.sector = 'Sector is required';
      if (!formData.cell) stepErrors.cell = 'Cell is required';
      if (!formData.village) stepErrors.village = 'Village is required';
      if (!formData.address) stepErrors.address = 'Detailed address is required';
    }
      else if (currentStep === 3) {
        if (!selectedSchool) stepErrors.school = 'Please select a school';
        if (!formData.contact.phone_number) stepErrors.phone_number = 'Phone number is required';
        if (!formData.contact.email) stepErrors.email = 'Email is required';
        
        // Validate email format
        if (formData.contact.email && !/\S+@\S+\.\S+/.test(formData.contact.email)) {
          stepErrors.email = 'Please enter a valid email address';
        }
        
        // Validate website format if provided
        if (formData.contact.website && !/^https?:\/\/\S+\.\S+/.test(formData.contact.website)) {
          stepErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
        }
    } else if (currentStep === 4) {
      if (!selectedSchool) stepErrors.school = 'Please select a school';
      if (!formData.admission_policy?.admission_policy) stepErrors.admission_policy = 'Admission policy is required';
      if (!formData.admission_policy?.discipline_policy) stepErrors.discipline_policy = 'Discipline policy is required';
    } else if (currentStep === 5) {
      if (!selectedSchool) stepErrors.school = 'Please select a school';
      // Government data validation is optional
    } else if (currentStep === 6) {
      if (!selectedSchool) stepErrors.school = 'Please select a school';
      // Fees validation is optional
    
    } else if (currentStep === 7) {
      if (!selectedSchool) stepErrors.school = 'Please select a school';
      // Alumni validation is optional
    }  else if (currentStep === 8) {
      if (!selectedSchool) stepErrors.school = 'Please select a school';
      // Image validation can be optional, but should check file types if provided
      if (formData.imageUploads.length > 0) {
        console.log(formData.imageUploads);
        const invalidImages = formData.imageUploads.filter(img => 
          img.file && !['image/jpeg', 'image/png'].includes(img.file.type)
        );
        
        if (invalidImages.length > 0) {
          stepErrors.images = 'Only JPG, JPEG, and PNG files are allowed';
        }
        
        const largeImages = formData.imageUploads.filter(img => 
          img.file && img.file.size > 5 * 1024 * 1024
        ); // 5MB limit
        if (largeImages.length > 0) {
          stepErrors.imageSize = 'Images must be less than 5MB in size';
        }
      }
    }
    
    return stepErrors;
  };
  
  // Handle step navigation
  const nextStep = () => {
    const stepErrors = validateCurrentStep();
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Scroll to the first error
      document.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setErrors({});
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  // Handle form submission based on current step
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current step
    const stepErrors = validateCurrentStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Scroll to the first error
      document.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (currentStep === 1) {
        // Submit basic school info
        const response = await apiClient.post(endpoints.education.schoolCreate, {
          school_code: parseInt(formData.school_code),
          school_name: formData.school_name,
          school_type: formData.school_type,
          school_level: formData.school_level,
          school_gender: formData.school_gender,
          school_ownership: formData.school_ownership,
          school_description: formData.school_description
        });
        
        setSuccess('School basic information saved successfully!');
        // Set the newly created school as selected
        if (response.data && response.data.id) {
          setSelectedSchool(response.data.id);
        }
        nextStep();
      } 
      else if (currentStep === 2) {
        // Submit location data
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
  
        const locationPayload = {
          school: selectedSchool,
          province: formData.province,
          district: formData.district,
          sector: formData.sector,
          cell: formData.cell,
          village: formData.village,
          address: formData.address,
          latitude: parseFloat(formData.latitude) || null,
          longitude: parseFloat(formData.longitude) || null
        };
  
        await apiClient.post(endpoints.education.schoolLocationCreate, locationPayload);
        
        setSuccess('School location information saved successfully!');
        nextStep();
      }
      else if (currentStep === 3) {
        // Submit contact information
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
        
        const contactPayload = {
          school: selectedSchool,
          phone_number: formData.contact.phone_number,
          whatsapp: formData.contact.whatsapp || null,
          email: formData.contact.email,
          website: formData.contact.website || null,
          social_media: {
            twitter: formData.contact.social_media.twitter || null,
            youtube: formData.contact.social_media.youtube || null,
            facebook: formData.contact.social_media.facebook || null,
            linkedin: formData.contact.social_media.linkedin || null,
            instagram: formData.contact.social_media.instagram || null
          }
        };
        
        await apiClient.post(endpoints.education.schoolContactCreate, contactPayload);
        
        setSuccess('Contact information saved successfully!');
        nextStep();
      }

      else if (currentStep === 4) {
        // Submit admission policy
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
        
        const admissionPolicyPayload = {
          admission_policy: formData.admission_policy.admission_policy,
          discipline_policy: formData.admission_policy.discipline_policy,
          parental_engagement: formData.admission_policy.parental_engagement || '',
          school: parseInt(selectedSchool)
        };
        
        await apiClient.post(endpoints.education.schoolAdmissionPolicyCreate, admissionPolicyPayload);
        
        setSuccess('Admission policy saved successfully!');
        nextStep();
      }

      else if (currentStep === 5) {
        // Submit government data
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
        
        // Filter out incomplete inspection records
        const validInspectionRecords = formData.government_data.inspection_record.filter(
          record => record.date && record.result
        );
        
        const governmentDataPayload = {
          school: parseInt(selectedSchool),
          government_supported: formData.government_data.government_supported,
          registration_date: formData.government_data.registration_date || null,
          inspection_record: validInspectionRecords
        };
        
        await apiClient.post(endpoints.education.schoolGovernmentDataCreate, governmentDataPayload);
        
        setSuccess('Government data saved successfully!');
        nextStep();
      }

      else if (currentStep === 6) {
        // Submit fees
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
        
        // Filter out incomplete fee entries
        const validFees = formData.fees.filter(
          fee => fee.currency && fee.amount
        );
        
        if (validFees.length > 0) {
          // Submit each fee individually as per API requirements
          for (const fee of validFees) {
            await apiClient.post(endpoints.education.schoolFeesCreate, {
              school: parseInt(selectedSchool),
              currency: fee.currency,
              amount: fee.amount
            });
          }
        }
        
        setSuccess('School fees saved successfully!');
        nextStep();
      }


      else if (currentStep === 7) {
        // Submit alumni data
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
  
        const validAlumni = formData.notable_alumni.filter(
          alumni => alumni.name.trim() !== '' && alumni.achievement.trim() !== ''
        );
        
        if (validAlumni.length > 0) {
          await apiClient.post(endpoints.education.schoolAlumniCreate, {
            school: selectedSchool,
            notable_alumni: validAlumni
          });
        }
        
        setSuccess('Alumni information saved successfully!');
        nextStep();
      }
      
      else if (currentStep === 8) {
        // Submit images
        if (!selectedSchool) {
          throw new Error('Please select a school.');
        }
        
        if (formData.imageUploads.length > 0 || formData.deletedImageIds.length > 0 || formData.updatedExistingImages.length > 0) {
          // Create form data to handle file uploads
          const imageFormData = new FormData();
          imageFormData.append('school', selectedSchool);
          
          // Add new images
          formData.imageUploads.forEach((image, index) => {
            imageFormData.append(`images`, image.file);
            imageFormData.append(`captions`, image.caption);
            imageFormData.append(`image_types`, image.image_type);
          });
          
          // Add deleted image IDs if any
          if (formData.deletedImageIds.length > 0) {
            imageFormData.append('deleted_image_ids', JSON.stringify(formData.deletedImageIds));
          }
          
          // Add updated existing images if any
          if (formData.updatedExistingImages.length > 0) {
            imageFormData.append('updated_images', JSON.stringify(formData.updatedExistingImages));
          }
          
          await apiClient.post(endpoints.education.schoolImagesUpload, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        
        setSuccess('School created successfully! You can now view it in your listings.');
        // Reset form or redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting school data:', err);
      const parsedErrors = parseErrors(err.response);
      setErrors(parsedErrors);
      // Scroll to error message
      document.querySelector(`.${styles.errorSummary}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render progress bar
  const calculateProgress = () => {
    return ((currentStep - 1) / totalSteps) * 100;
  };
  
  // Render error summary
  const renderErrorSummary = () => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return null;
    
    return (
      <div className={styles.errorSummary}>
        <div className={styles.errorTitle}>
          <BsExclamationTriangle className="me-2" />
          Please correct the following errors:
        </div>
        <ul className={styles.errorList}>
          {errorKeys.map(key => (
            <li key={key}>
              {Array.isArray(errors[key]) 
                ? errors[key].map((err, idx) => <div key={idx}>{err}</div>)
                : errors[key]}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Render current step form
  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoForm formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return (
          <LocationForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );
      case 3:
        return (
          <ContactForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );
      
      case 4:
        return (
          <AdmissionPolicyForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );
        
      case 5:
        return (
          <GovernmentDataForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );
      case 6:
        return (
          <FeesForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );

      case 7:
        return (
          <AlumniForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );
      case 8:
        return (
          <ImagesUploadForm
            formData={formData}
            updateFormData={updateFormData}
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            errors={errors}
          />
        );
      default:
        return <BasicInfoForm formData={formData} updateFormData={updateFormData} errors={errors} />;
    }
  };
  
  return (
    <div className={styles.schoolCreationContainer}>
      <h2 className={styles.formTitle}>Create New School</h2>
      
      <Card className={styles.formCard}>
        <Card.Header>
          <div className={styles.stepIndicator}>
            <span className={styles.stepLabel}>Step {currentStep} of {totalSteps}</span>
            <ProgressBar now={calculateProgress()} className={styles.progressBar} />
          </div>
        </Card.Header>
        
        <Card.Body>
          {success && (
            <Alert variant="success" className={styles.successAlert}>
              <div className="d-flex align-items-center">
                <BsCheck2Circle className="me-2" size={18} />
                <span>{success}</span>
              </div>
            </Alert>
          )}
          
          {renderErrorSummary()}
          
          <Form onSubmit={handleSubmit}>
            {renderStepForm()}
            
            <div className={styles.formActions}>
              {currentStep > 1 ? (
                <Button 
                  variant="outline-secondary" 
                  onClick={prevStep} 
                  disabled={isSubmitting}
                  className={styles.actionButton}
                >
                  <BsArrowLeft className="me-2" /> Back
                </Button>
              ) : (
                <Button 
                  variant="outline-secondary" 
                  onClick={onCancel} 
                  disabled={isSubmitting}
                  className={styles.actionButton}
                >
                  Cancel
                </Button>
              )}
              
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
                className={styles.actionButton}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : currentStep === totalSteps ? (
                  <>Finish</>
                ) : (
                  <>Continue <BsArrowRight className="ms-2" /></>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SchoolCreationForm;