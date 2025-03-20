import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import { BsCloudUpload, BsTrash, BsX, BsImage, BsPencil, BsPlus } from 'react-icons/bs';
import styles from './SchoolCreationForm.module.css';

const IMAGE_TYPES = [
  { value: 'EXTERIOR', label: 'Exterior' },
  { value: 'INTERIOR', label: 'Interior' },
  { value: 'CLASSROOM', label: 'Classroom' },
  { value: 'LABORATORY', label: 'Laboratory' },
  { value: 'LIBRARY', label: 'Library' },
  { value: 'SPORTS', label: 'Sports Facilities' },
  { value: 'HOSTEL', label: 'Hostel/Dormitory' },
  { value: 'CAFETERIA', label: 'Cafeteria' },
  { value: 'AUDITORIUM', label: 'Auditorium' },
  { value: 'EVENTS', label: 'Events' },
  { value: 'OTHER', label: 'Other' }
];

const ImagesUploadForm = ({ 
  formData, 
  updateFormData, 
  schools, 
  selectedSchool, 
  setSelectedSchool, 
  errors = {}, 
  isEditMode = false 
}) => {
  const [images, setImages] = useState([
    { file: null, caption: '', image_type: 'EXTERIOR', preview: null, uploading: false, progress: 0, error: null }
  ]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRefs = useRef([]);

  useEffect(() => {
    // Initialize form with existing data if available
    if (formData && formData.images && formData.images.length > 0) {
      setExistingImages(formData.images.map(img => ({
        id: img.id,
        url: img.url,
        caption: img.caption,
        image_type: img.image_type
      })));
    }
  }, [formData]);

  // Handle school selection
  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setSelectedSchool(schoolId);
  };

  // Handle file selection
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      const updatedImages = [...images];
      updatedImages[index].error = 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
      setImages(updatedImages);
      return;
    }
  
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const updatedImages = [...images];
      updatedImages[index].error = 'File size exceeds 5MB limit.';
      setImages(updatedImages);
      return;
    }

    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      file,
      preview: URL.createObjectURL(file),
      error: null
    };
    setImages(updatedImages);
    
    // Update parent component state
    const imageData = updatedImages.filter(img => img.file).map(img => ({
      file: img.file,
      caption: img.caption,
      image_type: img.image_type
    }));
    
    updateFormData({ 
      imageUploads: imageData
    });
  };

  // Handle caption change
  const handleCaptionChange = (index, e) => {
    const { value } = e.target;
    const updatedImages = [...images];
    updatedImages[index].caption = value;
    setImages(updatedImages);
    
    // Update parent component state
    const imageData = updatedImages.filter(img => img.file).map(img => ({
      file: img.file,
      caption: img.caption,
      image_type: img.image_type
    }));
    
    updateFormData({ 
      imageUploads: imageData
    });
  };

  // Handle image type change
  const handleImageTypeChange = (index, e) => {
    const { value } = e.target;
    const updatedImages = [...images];
    updatedImages[index].image_type = value;
    setImages(updatedImages);
    
    // Update parent component state
    const imageData = updatedImages.filter(img => img.file).map(img => ({
      file: img.file,
      caption: img.caption,
      image_type: img.image_type
    }));
    
    updateFormData({ 
      imageUploads: imageData
    });
  };

  // Add new image upload field
  const addImageField = () => {
    setImages([
      ...images,
      { file: null, caption: '', image_type: 'EXTERIOR', preview: null, uploading: false, progress: 0, error: null }
    ]);
  };

  // Remove image upload field
  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    
    // Update parent component state
    const imageData = updatedImages.filter(img => img.file).map(img => ({
      file: img.file,
      caption: img.caption,
      image_type: img.image_type
    }));
    
    updateFormData({ 
      imageUploads: imageData
    });
  };

  // Handle deleting existing image
  const handleDeleteExistingImage = (index) => {
    const updatedExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedExistingImages);
    
    // Update parent component state with deleted image ids
    const deletedImageId = existingImages[index].id;
    updateFormData({ 
      deletedImageIds: [...(formData.deletedImageIds || []), deletedImageId]
    });
  };

  // Handle updating existing image caption
  const handleExistingCaptionChange = (index, e) => {
    const { value } = e.target;
    const updatedExistingImages = [...existingImages];
    updatedExistingImages[index].caption = value;
    setExistingImages(updatedExistingImages);
    
    // Update parent component state
    updateFormData({ 
      updatedExistingImages: updatedExistingImages
    });
  };

  // Handle updating existing image type
  const handleExistingImageTypeChange = (index, e) => {
    const { value } = e.target;
    const updatedExistingImages = [...existingImages];
    updatedExistingImages[index].image_type = value;
    setExistingImages(updatedExistingImages);
    
    // Update parent component state
    updateFormData({ 
      updatedExistingImages: updatedExistingImages
    });
  };

  return (
    <div>
      <h4 className="mb-4">School Images</h4>
      
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
            Select the school you want to upload images for
          </Form.Text>
        </Form.Group>
      )}
      
      {uploadError && (
        <Alert variant="danger" className="mb-4">
          {uploadError}
        </Alert>
      )}
      
      {/* Existing Images (if any) */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3">Existing Images</h5>
          <Row>
            {existingImages.map((image, index) => (
              <Col md={4} key={`existing-${index}`} className="mb-4">
                <Card className={styles.imageCard}>
                  <Card.Img 
                    variant="top" 
                    src={image.url} 
                    className={styles.imagePreview}
                  />
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Caption</Form.Label>
                      <Form.Control
                        type="text"
                        value={image.caption}
                        onChange={(e) => handleExistingCaptionChange(index, e)}
                        placeholder="Enter image caption"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Image Type</Form.Label>
                      <Form.Select
                        value={image.image_type}
                        onChange={(e) => handleExistingImageTypeChange(index, e)}
                      >
                        {IMAGE_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="w-100"
                      onClick={() => handleDeleteExistingImage(index)}
                    >
                      <BsTrash className="me-2" /> Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
      
      {/* New Image Uploads */}
      <h5 className="mb-3">Upload New Images</h5>
      <Row>
        {images.map((image, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className={styles.imageCard}>
              <div className={styles.imageUploadContainer}>
                {image.preview ? (
                  <div className={styles.previewContainer}>
                    <img 
                      src={image.preview} 
                      alt={`Preview ${index + 1}`} 
                      className={styles.imagePreview}
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className={styles.removePreviewButton}
                      onClick={() => {
                        const updatedImages = [...images];
                        updatedImages[index].file = null;
                        updatedImages[index].preview = null;
                        setImages(updatedImages);
                        
                        // Clear file input
                        if (fileInputRefs.current[index]) {
                          fileInputRefs.current[index].value = '';
                        }
                      }}
                    >
                      <BsX />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className={styles.uploadPlaceholder}
                    onClick={() => fileInputRefs.current[index].click()}
                  >
                    <BsCloudUpload size={32} />
                    <p>Click to upload</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      ref={el => fileInputRefs.current[index] = el}
                      onChange={(e) => handleFileChange(index, e)}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
                
                {image.uploading && (
                  <ProgressBar 
                    now={image.progress} 
                    label={`${image.progress}%`} 
                    className="mt-2"
                  />
                )}
                
                {image.error && (
                  <Alert variant="danger" className="mt-2 p-2 small">
                    {image.error}
                  </Alert>
                )}
              </div>
              
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Caption</Form.Label>
                  <Form.Control
                    type="text"
                    value={image.caption}
                    onChange={(e) => handleCaptionChange(index, e)}
                    placeholder="Enter image caption"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image Type</Form.Label>
                  <Form.Select
                    value={image.image_type}
                    onChange={(e) => handleImageTypeChange(index, e)}
                  >
                    {IMAGE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <div className="d-flex justify-content-between">
                  {image.preview ? (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => fileInputRefs.current[index].click()}
                    >
                      <BsPencil className="me-1" /> Change
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => fileInputRefs.current[index].click()}
                    >
                      <BsImage className="me-1" /> Select
                    </Button>
                  )}
                  {images.length > 1 && (
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => removeImageField(index)}
                    >
                      <BsTrash className="me-1" /> Remove
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        
        <Col md={4} className="mb-4">
          <Button 
            variant="outline-primary" 
            className={styles.addImageButton}
            onClick={addImageField}
          >
            <BsPlus size={24} />
            <span>Add Another Image</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ImagesUploadForm;