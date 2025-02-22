import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarContent}>
            <div className={styles.topBarLeft}>
              <a href="tel:+250 788 454 344">📞 +250 (788) 454-344</a>
              <a href="mailto:support@diversedatahub.com">📧 support@diversedatahub.com</a>
            </div>
            <div className={styles.topBarRight}>
              <Link to="/business">List Your Business</Link>
              <Link to="/help">Help Center</Link>
              <select className={styles.languageSelect}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Link to="/" className={styles.logo}>
              <img src="/logo.svg" alt="DiverseDataHub" />
              <span>DiverseData<strong>Hub</strong></span>
            </Link>

            <div className={styles.searchBar}>
              <select className={styles.categorySelect}>
                <option value="">All Categories</option>
                {services.map((service, index) => (
                  <option key={index} value={service.toLowerCase()}>
                    {service}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search for services, businesses..."
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <span>Search</span>
              </button>
            </div>

            <button 
              className={styles.hamburger}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
              <div className={styles.primaryLinks}>
                <Link to="/" className={styles.navLink}>Home</Link>
                <div 
                  className={styles.dropdownContainer}
                  onMouseEnter={() => setShowServicesDropdown(true)}
                  onMouseLeave={() => setShowServicesDropdown(false)}
                >
                  <button className={styles.navLink}>
                    Services <span className={styles.arrow}>▾</span>
                  </button>
                  {showServicesDropdown && (
                    <div className={styles.servicesDropdown}>
                      {services.map((service, index) => (
                        <Link key={index} to={`/services/${service.toLowerCase()}`}>
                          {service}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/about" className={styles.navLink}>About</Link>
                <Link to="/contact" className={styles.navLink}>Contact</Link>
              </div>
              
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.loginButton}>Log In</Link>
                <Link to="/register" className={styles.registerButton}>Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;