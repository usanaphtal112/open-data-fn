
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>DiverseDataHub</h3>
          <p>Your one-stop platform for discovering and connecting with local service providers.</p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Popular Categories</h3>
          <ul>
            <li>Restaurants</li>
            <li>Hotels</li>
            <li>Healthcare</li>
            <li>Education</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact Info</h3>
          <ul>
            <li>Email: support@diversedatahub.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Business Avenue</li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} DiverseDataHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;