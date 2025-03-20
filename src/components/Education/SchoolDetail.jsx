import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Badge, Spinner, Alert, 
  Tabs, Tab, ListGroup, Button, Carousel 
} from 'react-bootstrap';
import { FaPhone, FaWhatsapp, FaEnvelope, FaGlobe, FaMapMarkerAlt, 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import educationService from '../../services/resources/educationService';
import SchoolDetailSkeleton from './SchoolDetailSkeleton';
import LocationDisplay from '../Common/LocationDisplay';
import styles from './SchoolDetail.module.css';
import { useTheme } from '../../contexts/ThemeContext';

const SchoolDetail = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme(); // Access the current theme

  useEffect(() => {
    const fetchSchoolDetail = async () => {
      try {
        setLoading(true);
        const data = await educationService.getSchoolDetail(id);
        setSchool(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load school details. Please try again later.');
        setLoading(false);
      }
    };

    fetchSchoolDetail();
  }, [id]);

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
    if (type === 'gender') {
      switch(code) {
        case 'MF': return 'Mixed';
        case 'M': return 'Boys';
        case 'F': return 'Girls';
        default: return code;
      }
    }
    if (type === 'admission') {
      switch(code) {
        case 'INTERVIEW': return 'Interview Required';
        case 'EXAM': return 'Entrance Exam';
        case 'OPEN': return 'Open Admission';
        default: return code;
      }
    }
    if (type === 'discipline') {
      switch(code) {
        case 'STRICT': return 'Strict';
        case 'MODERATE': return 'Moderate';
        case 'LENIENT': return 'Lenient';
        default: return code;
      }
    }
    return code;
  };

  // Helper to format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-RW', { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <SchoolDetailSkeleton />;
  }

  if (error) {
    return (
      <Container className={styles.schoolDetailContainer}>
        <div className={styles.alert + ' ' + styles.alertDanger}>{error}</div>
        <button 
          className={styles.backButton}
          onClick={() => window.location.href = '/schools-colleges'}
        >
          &larr; Back to Schools List
        </button>
      </Container>
    );
  }

  if (!school) {
    return (
      <Container className={styles.schoolDetailContainer}>
        <div className={styles.alert + ' ' + styles.alertWarning}>School not found</div>
        <button 
          className={styles.backButton}
          onClick={() => window.location.href = '/schools-colleges'}
        >
          &larr; Back to Schools List
        </button>
      </Container>
    );
  }

  return (
    <Container className={styles.schoolDetailContainer}>
      {/* Back Button */}
      <button 
        className={styles.backButton}
        onClick={() => window.location.href = '/schools-colleges'}
      >
        &larr; Back to Schools List
      </button>

      {/* School Header */}
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.schoolHeader}>
            <div>
              <div className="d-flex align-items-center mb-2">
                <h1 className={styles.schoolTitle}>{school.school_name}</h1>
                {school.verified && (
                  <span className={`${styles.badge} ${styles.badgeSuccess} ms-3`}>Verified</span>
                )}
              </div>
              <p className={styles.schoolCode}>School Code: {school.school_code}</p>
              
              <div className={styles.badgeContainer}>
                <span className={`${styles.badge} ${styles.badgeInfo}`}>{getReadableValue(school.school_type, 'type')}</span>
                <span className={`${styles.badge} ${styles.badgePrimary}`}>{getReadableValue(school.school_level, 'level')}</span>
                <span className={`${styles.badge} ${styles.badgeSecondary}`}>{getReadableValue(school.school_gender, 'gender')}</span>
                <span className={`${styles.badge} ${styles.badgeDark}`}>{getReadableValue(school.school_ownership, 'ownership')}</span>
              </div>
              
              {school.location && (
                <div className={styles.locationContainer}>
                  <FaMapMarkerAlt className={styles.locationIcon} />
                  <span>
                    {school.location.address}, {<LocationDisplay code={school.location.sector} type="sector" />}, {<LocationDisplay code={school.location.district} type="district" />}
                  </span>
                </div>
              )}
            </div>
            
            <div className={styles.ratingBox}>
              <div className="mb-2">
                <span className={styles.ratingStars}>★</span>
                <span className={styles.ratingValue}>{school.average_rating}</span>
                <span className={styles.reviewCount}>({school.review_count} reviews)</span>
              </div>
              
              {school.fees && (
                <div className={styles.feesContainer}>
                  <p className={styles.feesLabel}>Annual Fees:</p>
                  <h4 className={styles.feesAmount}>{formatCurrency(school.fees.amount, school.fees.currency)}</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* School Images Carousel */}
      {school.images && school.images.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <Carousel className={styles.carousel}>
              {school.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className={styles.carouselImage}
                    src={image.image}
                    alt={image.caption || `School image ${index + 1}`}
                  />
                  {image.caption && (
                    <Carousel.Caption>
                      <h3>{image.caption}</h3>
                    </Carousel.Caption>
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabItem} ${activeTab === 'overview' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'admission' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('admission')}
        >
          Admission & Policies
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'contact' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Information
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'alumni' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('alumni')}
        >
          Notable Alumni
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.card}>
        <div className={styles.cardBody}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <h3 className={styles.sectionTitle}>About the School</h3>
              <p>{school.school_description || "No description available for this school."}</p>
              
              {school.government_data && (
                <div className="mt-4">
                  <h4 className={styles.subsectionTitle}>Government Status</h4>
                  <p>
                    <span className={`${styles.badge} ${school.government_data.government_supported ? styles.badgeSuccess : styles.badgeSecondary}`}>
                      {school.government_data.government_supported ? "Government Supported" : "Not Government Supported"}
                    </span>
                  </p>
                  <p>Registered since: {new Date(school.government_data.registration_date).toLocaleDateString()}</p>
                </div>
              )}
            </>
          )}

          {/* Admission Tab */}
          {activeTab === 'admission' && (
            <>
              {school.admission ? (
                <>
                  <h3 className={styles.sectionTitle}>Admission Information</h3>
                  <Row>
                    <Col md={6}>
                      <ul className={styles.listGroup}>
                        <li className={styles.listItem}>
                          <strong>Admission Policy:</strong> {getReadableValue(school.admission.admission_policy, 'admission')}
                        </li>
                        <li className={styles.listItem}>
                          <strong>Discipline Policy:</strong> {getReadableValue(school.admission.discipline_policy, 'discipline')}
                        </li>
                        <li className={styles.listItem}>
                          <strong>Parental Engagement:</strong> {school.admission.parental_engagement}
                        </li>
                      </ul>
                    </Col>
                    
                    <Col md={6}>
                      {school.fees && (
                        <div className={styles.ratingBox}>
                          <h4 className={styles.subsectionTitle}>Fee Information</h4>
                          <p className={styles.feesLabel}>Annual Tuition Fee:</p>
                          <h3 className={styles.feesAmount}>{formatCurrency(school.fees.amount, school.fees.currency)}</h3>
                          <small className={styles.reviewCount}>
                            Note: Additional costs may apply for materials, uniforms, and other school activities.
                          </small>
                        </div>
                      )}
                    </Col>
                  </Row>
                  
                  {school.government_data?.inspection_record?.inspection_records && (
                    <div className="mt-5">
                      <h4 className={styles.subsectionTitle}>Inspection Records</h4>
                      <ul className={styles.listGroup}>
                        {school.government_data.inspection_record.inspection_records.map((record, index) => (
                          <li key={index} className={styles.listItem}>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Inspection Date: {new Date(record.date).toLocaleDateString()}</span>
                              <span className={`${styles.badge} ${record.result === "Compliant" ? styles.badgeSuccess : styles.badgeWarning}`}>
                                {record.result}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className={`${styles.alert} ${styles.alertInfo}`}>No admission information available for this school.</div>
              )}
            </>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
              
              {school.contact ? (
                <Row>
                  <Col md={6}>
                    <h4 className={styles.subsectionTitle}>Direct Contact</h4>
                    <ul className={styles.listGroup}>
                      {school.contact.phone_number && (
                        <li className={styles.listItem}>
                          <div className="d-flex align-items-center">
                            <div className={`${styles.contactIcon} ${styles.iconPrimary}`}>
                              <FaPhone />
                            </div>
                            <div>
                              <strong>Phone:</strong><br />
                              <a href={`tel:${school.contact.phone_number}`}>{school.contact.phone_number}</a>
                            </div>
                          </div>
                        </li>
                      )}
                      
                      {school.contact.whatsapp && (
                        <li className={styles.listItem}>
                          <div className="d-flex align-items-center">
                            <div className={`${styles.contactIcon} ${styles.iconSuccess}`}>
                              <FaWhatsapp />
                            </div>
                            <div>
                              <strong>WhatsApp:</strong><br />
                              <a href={`https://wa.me/${school.contact.whatsapp.replace('+', '')}`}>{school.contact.whatsapp}</a>
                            </div>
                          </div>
                        </li>
                      )}
                      
                      {school.contact.email && (
                        <li className={styles.listItem}>
                          <div className="d-flex align-items-center">
                            <div className={`${styles.contactIcon} ${styles.iconInfo}`}>
                              <FaEnvelope />
                            </div>
                            <div>
                              <strong>Email:</strong><br />
                              <a href={`mailto:${school.contact.email}`}>{school.contact.email}</a>
                            </div>
                          </div>
                        </li>
                      )}
                      
                      {school.contact.website && (
                        <li className={styles.listItem}>
                          <div className="d-flex align-items-center">
                            <div className={`${styles.contactIcon} ${styles.iconSecondary}`}>
                              <FaGlobe />
                            </div>
                            <div>
                              <strong>Website:</strong><br />
                              <a href={school.contact.website} target="_blank" rel="noopener noreferrer">
                                {school.contact.website}
                              </a>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </Col>
                  
                  <Col md={6}>
                    {school.contact.social_media && Object.keys(school.contact.social_media).some(key => school.contact.social_media[key]) && (
                      <div className="mt-4 mt-md-0">
                        <h4 className={styles.subsectionTitle}>Social Media</h4>
                        <div className={styles.socialLinks}>
                          {school.contact.social_media.facebook && (
                            <a 
                              href={school.contact.social_media.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${styles.socialButton} ${styles.buttonOutlinePrimary}`}
                            >
                              <FaFacebookF className="me-2" /> Facebook
                            </a>
                          )}
                          
                          {school.contact.social_media.twitter && (
                            <a 
                              href={school.contact.social_media.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${styles.socialButton} ${styles.buttonOutlineInfo}`}
                            >
                              <FaTwitter className="me-2" /> Twitter
                            </a>
                          )}
                          
                          {school.contact.social_media.instagram && (
                            <a 
                              href={school.contact.social_media.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${styles.socialButton} ${styles.buttonOutlineDanger}`}
                            >
                              <FaInstagram className="me-2" /> Instagram
                            </a>
                          )}
                          
                          {school.contact.social_media.linkedin && (
                            <a 
                              href={school.contact.social_media.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${styles.socialButton} ${styles.buttonOutlinePrimary}`}
                            >
                              <FaLinkedinIn className="me-2" /> LinkedIn
                            </a>
                          )}
                          
                          {school.contact.social_media.youtube && (
                            <a 
                              href={school.contact.social_media.youtube} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${styles.socialButton} ${styles.buttonOutlineDanger}`}
                            >
                              <FaYoutube className="me-2" /> YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {school.location && (
                      <div className="mt-4">
                        <h4 className={styles.subsectionTitle}>Location</h4>
                        <div className={styles.card}>
                          <div className={styles.cardBody}>
                          <p>
                            <strong>Province:</strong> <LocationDisplay 
                              code={school.location.province} 
                              type="province" 
                            />
                          </p>
                          <p>
                            <strong>District:</strong> <LocationDisplay 
                              code={school.location.district} 
                              type="district" 
                            />
                          </p>
                          <p>
                            <strong>Sector:</strong> <LocationDisplay 
                              code={school.location.sector} 
                              type="sector" 
                            />
                          </p>
                          {school.location.cell && (
                            <p>
                              <strong>Cell:</strong> <LocationDisplay 
                                code={school.location.cell} 
                                type="cell" 
                              />
                            </p>
                          )}
                          {school.location.village && (
                            <p>
                              <strong>Village:</strong> <LocationDisplay 
                                code={school.location.village} 
                                type="village" 
                              />
                            </p>
                          )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              ) : (
                <div className={`${styles.alert} ${styles.alertInfo}`}>No contact information available for this school.</div>
              )}
            </>
          )}

          {/* Alumni Tab */}
          {activeTab === 'alumni' && (
            <>
              <h3 className={styles.sectionTitle}>Notable Alumni</h3>
              
              {school.alumni && school.alumni.notable_alumni && school.alumni.notable_alumni.length > 0 ? (
                <Row className="row-cols-1 row-cols-md-2 g-4">
                  {school.alumni.notable_alumni.map((alumni, index) => (
                    <Col key={index}>
                      <div className={styles.card + ' h-100'}>
                        <div className={styles.cardBody}>
                          <h4 className={styles.subsectionTitle}>{alumni.name}</h4>
                          <p>{alumni.achievement}</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className={`${styles.alert} ${styles.alertInfo}`}>No notable alumni information available for this school.</div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SchoolDetail;