import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Nav, Spinner, Alert, Badge } from 'react-bootstrap';
import { 
  BsBuilding, 
  BsHospital, 
  BsBook, 
  BsShop, 
  BsPlus, 
  BsPencil, 
  BsGeoAlt, 
  BsPeople,
  BsPatchCheck,
  BsPatchExclamation,
  BsGenderFemale,
  BsGenderMale,
  BsGenderAmbiguous,
  BsHouseDoor,
  BsBriefcase,
  BsBuildings,
  BsArrowRight,
  BsEye
} from 'react-icons/bs';
import apiClient from '../../../services/api/client';
import { endpoints } from '../../../services/api/endpoints';
import SchoolCreationForm from './SchoolCreation/SchoolCreationForm';
import SchoolEditFlow from './SchoolCreation/SchoolEditFlow';
import styles from './BusinessListingsTab.module.css';

const BusinessListingsTab = ({ userData }) => {
  const [activeView, setActiveView] = useState('listings');
  const [createType, setCreateType] = useState(null);
  const [editType, setEditType] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [initialStep, setInitialStep] = useState(1);

  // Fetch user's business listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Fetch user's listings from the API
        const response = await apiClient.get(endpoints.education.userSchools);
        setListings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching business listings:', err);
        setError('Failed to load your business listings. Please try again later.');
        setLoading(false);
      }
    };

    if (activeView === 'listings') {
      fetchListings();
    }
  }, [activeView]);

  // Handle creating a new business listing
  const handleCreateBusiness = (type) => {
    setCreateType(type);
    setActiveView('create');
  };

  // Handle editing an existing business listing
  const handleEditBusiness = (school, step = 1) => {
    setSelectedSchool(school.id);
    setInitialStep(step);
    setEditType('school');
    setActiveView('edit');
  };

  // Handle canceling business creation/editing
  const handleCancel = () => {
    setCreateType(null);
    setEditType(null);
    setSelectedSchool(null);
    setActiveView('listings');
  };

  // Get gender icon based on school_gender
  const getGenderIcon = (gender) => {
    switch(gender) {
      case 'F':
        return <BsGenderFemale />;
      case 'M':
        return <BsGenderMale />;
      case 'MF':
      default:
        return <BsGenderAmbiguous />;
    }
  };

  // Get school type icon
  const getSchoolTypeIcon = (type) => {
    switch(type) {
      case 'BOARDING':
        return <BsHouseDoor />;
      case 'DAY':
      default:
        return <BsBriefcase />;
    }
  };

  // Get school ownership icon
  const getOwnershipIcon = (ownership) => {
    switch(ownership) {
      case 'PRIVATE':
        return <BsBuilding />;
      case 'PUBLIC':
      default:
        return <BsBuildings />;
    }
  };

  // Render creation form based on business type
  const renderCreationForm = () => {
    switch (createType) {
      case 'school':
        return <SchoolCreationForm onCancel={handleCancel} />;
      case 'hospital':
        return <div>Hospital Creation Form (Not Implemented Yet)</div>;
      case 'restaurant':
        return <div>Restaurant Creation Form (Not Implemented Yet)</div>;
      default:
        return <div>Select a business type to create</div>;
    }
  };

  // Render edit form based on business type
  const renderEditForm = () => {
    switch (editType) {
      case 'school':
        return <SchoolEditFlow initialStep={initialStep} schoolId={selectedSchool} onCancel={handleCancel} />;
      default:
        return <div>Select a business to edit</div>;
    }
  };

  // Render business type options
  const renderBusinessOptions = () => {
    const businessTypes = [
      { id: 'school', name: 'School', icon: <BsBook className={styles.businessTypeIcon} /> },
      { id: 'hospital', name: 'Hospital', icon: <BsHospital className={styles.businessTypeIcon} /> },
      { id: 'restaurant', name: 'Restaurant', icon: <BsShop className={styles.businessTypeIcon} /> },
      // Add more business types as needed
    ];

    return (
      <Row className="mt-4">
        <Col md={12} className="mb-4">
          <h4>Select Business Type</h4>
          <p className="text-muted">Choose the type of business listing you want to create</p>
        </Col>
        {businessTypes.map((type) => (
          <Col key={type.id} md={4} className="mb-4">
            <div
              className={styles.businessTypeCard}
              onClick={() => handleCreateBusiness(type.id)}
            >
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                {type.icon}
                <span className={styles.businessTypeName}>{type.name}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  // Helper function to check if a listing has a specific component
  const hasComponent = (listing, component) => {
    if (!listing) return false;
    
    switch (component) {
      case 'location':
        return Boolean(listing.location);
      case 'alumni':
        return Boolean(listing.notable_alumni && listing.notable_alumni.length > 0);
      case 'contact':
        return Boolean(listing.contact);
      case 'admission':
        return Boolean(listing.admission_policy);
      case 'government':
        return Boolean(listing.government_data);
      case 'images':
        return Boolean(listing.images && listing.images.length > 0);
      default:
        return false;
    }
  };

  // Render business listings
  const renderListings = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Spinner animation="border" className={styles.spinner}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorAlert}>
          <p className="m-0">{error}</p>
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className={styles.noListings}>
          <div className={styles.noListingsIcon}>
            <BsBuilding size={64} />
          </div>
          <h3>No Business Listings</h3>
          <p>You haven't created any business listings yet.</p>
          <button
            className={styles.actionButton}
            onClick={() => setActiveView('new')}
          >
            <BsPlus /> Create Your First Listing
          </button>
        </div>
      );
    }

    return (
      <Row>
        {listings.map((listing) => (
          <Col key={listing.id} md={4} className="mb-4">
            <div className={styles.listingCard}>
              {/* Verification Badge - Now positioned absolutely on top of the image */}
              <div className={listing.verified ? styles.verificationBadgeTop : `${styles.verificationBadgeTop} ${styles.noVerification}`}>
                {listing.verified ? (
                  <>
                    <BsPatchCheck /> Verified
                  </>
                ) : (
                  <>
                    <BsPatchExclamation /> Not Verified
                  </>
                )}
              </div>
              
              {listing.cover ? (
                <div 
                  className={styles.listingImage} 
                  style={{ backgroundImage: `url(${listing.cover})` }}
                />
              ) : (
                <div className={styles.listingDefault}>
                  <BsBook />
                </div>
              )}
              <div className={styles.listingContent}>
                <h5 className={styles.listingTitle}>{listing.school_name}</h5>
                <div className={styles.listingSubtitle}>
                  <span>School Code: {listing.school_code}</span>
                </div>
                
                <div className={styles.listingInfo}>
                  <span className={styles.listingBadge}>
                    {getSchoolTypeIcon(listing.school_type)} {listing.school_type}
                  </span>
                  <span className={styles.listingBadge}>
                    {getGenderIcon(listing.school_gender)} {listing.school_gender === 'MF' ? 'Mixed' : listing.school_gender === 'F' ? 'Girls' : 'Boys'}
                  </span>
                  <span className={styles.listingBadge}>
                    {getOwnershipIcon(listing.school_ownership)} {listing.school_ownership}
                  </span>
                  <span className={styles.listingBadge}>
                    <BsBook /> {listing.school_level}
                  </span>
                </div>
                
                <div className="mb-3">
                  <h6>School Components:</h6>
                  <div className={styles.componentBadges}>
                    <Badge 
                      bg={hasComponent(listing, 'location') ? "success" : "secondary"}
                      className={`d-flex align-items-center ${styles.componentBadge} ${!hasComponent(listing, 'location') ? styles.incompleteComponent : ''}`}
                      onClick={() => hasComponent(listing, 'location') ? null : handleEditBusiness(listing, 2)}
                      style={{cursor: hasComponent(listing, 'location') ? "default" : "pointer"}}
                    >
                      <BsGeoAlt className="me-1" /> Location
                    </Badge>
                    <Badge 
                      bg={hasComponent(listing, 'alumni') ? "success" : "secondary"}
                      className={`d-flex align-items-center ${styles.componentBadge} ${!hasComponent(listing, 'alumni') ? styles.incompleteComponent : ''}`}
                      onClick={() => hasComponent(listing, 'alumni') ? null : handleEditBusiness(listing, 3)}
                      style={{cursor: hasComponent(listing, 'alumni') ? "default" : "pointer"}}
                    >
                      <BsPeople className="me-1" /> Alumni
                    </Badge>
                    {/* Add more badges for other components */}
                  </div>
                </div>
                
                <div className={styles.listingActions}>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditBusiness(listing, 1)}
                  >
                    <BsPencil /> Edit
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={() => {
                      window.location.href = `/schools-colleges/${listing.id}`;
                    }}
                  >
                    <BsEye className={styles.viewIcon} /> View Details
                    <BsArrowRight className={styles.arrowIcon} />
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className={styles.container}>
      {/* Custom Nav Tabs */}
      <div className={styles.navTabs}>
        <button
          onClick={() => setActiveView('listings')}
          className={`${styles.navLink} ${activeView === 'listings' ? styles.navLinkActive : ''}`}
        >
          My Listings
        </button>
        <button
          onClick={() => setActiveView('new')}
          className={`${styles.navLink} ${activeView === 'new' ? styles.navLinkActive : ''}`}
        >
          Create New Listing
        </button>
      </div>

      <div className={styles.content}>
        {activeView === 'listings' && renderListings()}
        {activeView === 'new' && renderBusinessOptions()}
        {activeView === 'create' && renderCreationForm()}
        {activeView === 'edit' && renderEditForm()}
      </div>
    </div>
  );
};

export default BusinessListingsTab;