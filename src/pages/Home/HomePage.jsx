import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

// Component for Search Section
const SearchBar = () => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <div className={styles.locationInput}>
          <i className={`${styles.locationIcon} bi bi-geo-alt`}></i>
          <input 
            type="text" 
            placeholder="Enter your location"
            className={styles.locationField}
            aria-label="Location"
          />
        </div>
        
        <div className={styles.serviceInput}>
          <i className={`${styles.searchIcon} bi bi-search`}></i>
          <input 
            type="text" 
            placeholder="What service are you looking for?"
            className={styles.searchField}
            aria-label="Service search"
          />
        </div>
        
        <button className={styles.searchButton} aria-label="Search">
          Search
        </button>
      </div>
      
      <div className={styles.popularSearches}>
        <span>Popular:</span>
        {['Restaurants', 'Hotels', 'Healthcare', 'Education'].map(item => (
          <Link key={item} to={`/${item.toLowerCase()}`} className={styles.popularLink}>
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

// Component for Stats Display
const StatsDisplay = ({ stats }) => {
  return (
    <motion.div 
      className={styles.heroStats}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index} 
          className={styles.statItem}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
        >
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Component for Category Card
const CategoryCard = ({ category }) => {
  return (
    <motion.div 
      className={styles.categoryCard}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className={styles.categoryIcon} aria-hidden="true">
        <i className={`bi ${category.iconClass}`}></i>
      </div>
      <h3>{category.title}</h3>
      <ul className={styles.serviceList}>
        {category.services.map((service, index) => (
          <li key={index}>
            <span>{service.name}</span>
            <span className={styles.serviceCount}>{service.count}+</span>
          </li>
        ))}
      </ul>
      <Link to={`/categories/${category.id}`} className={styles.categoryLink}>
        View All <i className="bi bi-arrow-right"></i>
      </Link>
    </motion.div>
  );
};

// Component for Feature Card
const FeatureCard = ({ feature }) => {
  return (
    <motion.div 
      className={styles.featureCard}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <div className={styles.featureIcon}>
        <i className={`bi ${feature.iconClass}`}></i>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </motion.div>
  );
};

// Component for Testimonial Card
const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div 
      className={styles.testimonialCard}
      whileHover={{ y: -5 }}
    >
      <div className={styles.testimonialRating}>
        {[...Array(5)].map((_, i) => (
          <i key={i} className="bi bi-star-fill"></i>
        ))}
      </div>
      <p className={styles.testimonialContent}>"{testimonial.content}"</p>
      <div className={styles.testimonialHeader}>
        <img 
          src={testimonial.image} 
          alt={`${testimonial.name} profile`} 
          loading="lazy"
        />
        <div>
          <h4>{testimonial.name}</h4>
          <p>{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: '50K+', label: 'Listed Businesses' },
    { value: '100+', label: 'Categories' },
    { value: '1M+', label: 'Happy Users' }
  ];

  const categories = [
    {
      id: 'hospitality',
      title: 'Hospitality & Dining',
      iconClass: 'bi-buildings',
      services: [
        { name: 'Premium Restaurants', count: 1200 },
        { name: 'Luxury Hotels', count: 450 },
        { name: 'Wellness Spas', count: 320 }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      iconClass: 'bi-hospital',
      services: [
        { name: 'Hospitals', count: 580 },
        { name: 'Dental Clinics', count: 890 },
        { name: 'Specialty Care', count: 670 }
      ]
    },
    {
      id: 'education',
      title: 'Education & Training',
      iconClass: 'bi-mortarboard',
      services: [
        { name: 'Universities', count: 240 },
        { name: 'Vocational Schools', count: 350 },
        { name: 'Tutoring Centers', count: 780 }
      ]
    },
    {
      id: 'realestate',
      title: 'Real Estate',
      iconClass: 'bi-house-door',
      services: [
        { name: 'Residential Properties', count: 2400 },
        { name: 'Commercial Spaces', count: 890 },
        { name: 'Property Management', count: 340 }
      ]
    },
    {
      id: 'automotive',
      title: 'Automotive',
      iconClass: 'bi-car-front',
      services: [
        { name: 'Auto Repair', count: 1150 },
        { name: 'Car Dealerships', count: 620 },
        { name: 'Car Rentals', count: 380 }
      ]
    },
    {
      id: 'professional',
      title: 'Professional Services',
      iconClass: 'bi-briefcase',
      services: [
        { name: 'Legal Services', count: 950 },
        { name: 'Financial Advisors', count: 780 },
        { name: 'Marketing Agencies', count: 560 }
      ]
    }
  ];

  const features = [
    {
      title: 'Verified Providers',
      description: 'All service providers undergo thorough verification for your peace of mind',
      iconClass: 'bi-check-circle'
    },
    {
      title: 'Real Reviews',
      description: 'Authentic reviews and ratings from verified customers',
      iconClass: 'bi-star'
    },
    {
      title: 'Secure Booking',
      description: 'Safe and secure platform for all your transactions',
      iconClass: 'bi-shield-lock'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for assistance',
      iconClass: 'bi-headset'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Restaurant Owner',
      image: '/man.png',
      content: 'DiverseDataHub has transformed how we connect with customers. Our bookings have increased by 60% since joining the platform.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Healthcare Provider',
      image: '/man.png',
      content: "The platform's seamless integration and user-friendly interface have made it easier for patients to find and book appointments with us."
    },
    {
      id: 3,
      name: 'Amanda Williams',
      role: 'Event Planner',
      image: '/man.png',
      content: 'As an event planner, having access to such a diverse range of vendors in one place has streamlined my workflow significantly.'
    }
  ];

  return (
    <div className={`${styles.homePage} ${styles[theme]}`}>
      {/* Hero Section with Animation */}
      <motion.section 
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover & Connect with the Best Local Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Your one-stop platform for finding trusted service providers in your area
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        <StatsDisplay stats={stats} />
      </motion.section>

      {/* Categories Section with Improved Filtering */}
      <section className={styles.categories} id="categories">
        <div className={styles.sectionHeader}>
          <h2>Explore Categories</h2>
          <div className={styles.categoryFilters}>
            {['all', 'popular', 'trending'].map(category => (
              <button 
                key={category}
                className={`${styles.filterButton} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category === 'all' ? 'All Categories' : 
                 category === 'popular' ? 'Most Popular' : 'Trending Now'}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.categoryGrid} aria-live="polite">
          {isLoading ? (
            // Skeleton loading state
            [...Array(4)].map((_, index) => (
              <div key={index} className={`${styles.categoryCard} ${styles.skeleton}`}>
                <div className={`${styles.categoryIcon} ${styles.skeletonCircle}`}></div>
                <div className={`${styles.skeletonText} ${styles.skeletonTitle}`}></div>
                <div className={styles.serviceList}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles.skeletonText}></div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Actual content
            categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>

        <div className={styles.viewAllContainer}>
          <Link to="/categories" className={styles.viewAllButton}>
            View All Categories <i className="bi bi-arrow-right-circle"></i>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <h2>Why Choose Us</h2>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials} id="testimonials">
        <h2>What Our Users Say</h2>
        <motion.div 
          className={styles.testimonialGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </motion.div>
        
        <div className={styles.testimonialActions}>
          <button className={styles.testimonialButton}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className={styles.testimonialDots}>
            {[0, 1, 2].map(i => (
              <span 
                key={i} 
                className={`${styles.dot} ${i === 0 ? styles.activeDot : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              ></span>
            ))}
          </div>
          <button className={styles.testimonialButton}>
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to List Your Business?</h2>
          <p>Join thousands of businesses reaching new customers every day</p>
          <div className={styles.ctaButtons}>
            <Link to="/register" className={styles.primaryButton}>
              Get Started <i className="bi bi-arrow-right"></i>
            </Link>
            <Link to="/how-it-works" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;