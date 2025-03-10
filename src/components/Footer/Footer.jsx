import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Container>
        {/* Main Footer Content */}
        <Row className="mb-4">
          {/* Logo and Company Info Section */}
          <Col lg={3} md={6} sm={12} className="mb-4">
            <Link to="/" aria-label="Go to Home Page">
              <Image 
                src="/logo.svg"
                alt="DiverseDataHub Logo" 
                width={150} 
                className="mb-3" 
                fluid 
              />
            </Link>
            <p className="mt-3">Your one-stop platform for discovering and connecting with local service providers.</p>
          </Col>
          
          {/* Quick Links Section */}
          <Col lg={3} md={6} sm={12} className="mb-4">
            <h5 className={`mb-3 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Home</Link></li>
              <li className="mb-2"><Link to="/about" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Contact</Link></li>
              <li className="mb-2"><Link to="/services" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Services</Link></li>
            </ul>
          </Col>
          
          {/* Popular Categories Section */}
          <Col lg={3} md={6} sm={12} className="mb-4">
            <h5 className={`mb-3 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}>Popular Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/category/restaurants" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Restaurants</Link></li>
              <li className="mb-2"><Link to="/category/hotels" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Hotels</Link></li>
              <li className="mb-2"><Link to="/category/healthcare" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Healthcare</Link></li>
              <li className="mb-2"><Link to="/category/education" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Education</Link></li>
            </ul>
          </Col>
          
          {/* Contact Info Section */}
          <Col lg={3} md={6} sm={12} className="mb-4">
            <h5 className={`mb-3 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}>Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="mailto:support@diversedatahub.com" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                  <i className="bi bi-envelope me-2"></i>support@diversedatahub.com
                </a>
              </li>
              <li className="mb-2">
                <a href="tel:+15551234567" className={`text-decoration-none ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                  <i className="bi bi-telephone me-2"></i>+1 (555) 123-4567
                </a>
              </li>
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>123 Business Avenue
              </li>
            </ul>
            
            {/* Social Media Icons */}
            <div className="mt-4">
              <h5 className={`mb-3 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}>Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                  <FaFacebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                  <FaTwitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                  <FaInstagram size={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn page" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Divider */}
        <hr className={`my-4 ${theme === 'dark' ? 'border-secondary' : 'border-primary'}`} />
        
        {/* Copyright Section */}
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {currentYear} DiverseDataHub. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;