import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import ThemeToggle from '../Common/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';
import { isAuthenticated, logoutUser } from '../../services/resources/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Services data - moved outside component for better performance
  const services = [
    'Restaurants & Dining',
    'Hotels & Accommodation',
    'Healthcare Services',
    'Beauty & Wellness',
    'Home & Living',
    'Education & Training',
    'Wedding Services',
    'Real Estate',
    'Transportation'
  ];

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    // Check authentication status
    setIsLoggedIn(isAuthenticated());

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.topBar}>
        <div className={`${styles.container} ${styles.topBarContent}`}>
          <div className={styles.topBarLeft}>
            <a href="tel:+250788454344" aria-label="Call our support">
              <svg className={styles.icon} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +250 (788) 454-344
            </a>
            <a href="mailto:support@diversedatahub.com" aria-label="Email our support">
              <svg className={styles.icon} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6l-10 7-10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              support@diversedatahub.com
            </a>
          </div>

          <div className={styles.topBarRight}>
            <Link to="/list-business" className={styles.topBarLink}>List Your Business</Link>
            <Link to="/help" className={styles.topBarLink}>Help Center</Link>
            <div className={styles.languageSelector}>
              <select className={styles.languageSelect} aria-label="Select language">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
              <svg className={styles.selectArrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className={styles.mainNav} role="navigation">
        <div className={`${styles.container} ${styles.navContent}`}>
          <Link to="/" className={styles.logo} aria-label="DiverseDataHub Home">
            <img src="/logo.svg" alt="" />
            <span>Diverse<strong>DataHub</strong></span>
          </Link>

          <div className={styles.searchBar}>
            <div className={styles.categorySelectWrapper}>
              <select className={styles.categorySelect} aria-label="Select category">
                <option>All Categories</option>
                {services.map((service, index) => (
                  <option key={index}>{service}</option>
                ))}
              </select>
              <svg className={styles.selectArrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for businesses..."
              className={styles.searchInput}
              aria-label="Search for businesses"
            />
            <button className={styles.searchButton} aria-label="Search">
              <svg className={styles.searchIcon} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Search</span>
            </button>
          </div>

          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div id="mobile-menu" className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
            <div className={styles.primaryLinks}>
              <Link to="/" className={styles.navLink}>
                Home
              </Link>

              <div
                className={styles.dropdownContainer}
                onMouseEnter={() => setShowServicesDropdown(true)}
                onMouseLeave={() => setShowServicesDropdown(false)}
              >
                <button 
                  className={styles.navLink}
                  aria-expanded={showServicesDropdown}
                  aria-controls="services-dropdown"
                  onKeyDown={(e) => handleKeyDown(e, () => setShowServicesDropdown(!showServicesDropdown))}
                >
                  Services
                  <svg className={styles.dropdownArrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showServicesDropdown && (
                  <div id="services-dropdown" className={styles.servicesDropdown}>
                    {services.map((service, index) => (
                      <Link key={index} to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}>
                        {service}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/about" className={styles.navLink}>
                About
              </Link>
              <Link to="/contact" className={styles.navLink}>
                Contact
              </Link>
            </div>
            
            {/* Conditional rendering based on authentication status */}
            {isLoggedIn ? (
              <div className={styles.userMenu}>
                <div
                  className={styles.dropdownContainer}
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <button 
                    className={`${styles.navLink} ${styles.userButton}`}
                    aria-expanded={showUserDropdown}
                    aria-controls="user-dropdown"
                    onKeyDown={(e) => handleKeyDown(e, () => setShowUserDropdown(!showUserDropdown))}
                  >
                    <svg className={styles.userIcon} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    My Account
                    <svg className={styles.dropdownArrow} aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {showUserDropdown && (
                    <div id="user-dropdown" className={styles.servicesDropdown}>
                      <Link to="/dashboard">Dashboard</Link>
                      <Link to="/profile">Profile</Link>
                      <Link to="/favorites">Favorites</Link>
                      <Link to="/settings">Settings</Link>
                      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.loginButton}>
                  Log In
                </Link>
                <Link to="/register" className={styles.registerButton}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;