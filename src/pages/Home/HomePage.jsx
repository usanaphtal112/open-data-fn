import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Registration from '../../components/Registration/RegisterForm';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    {
      id: 'hospitality',
      title: 'Hospitality & Dining',
      icon: '🏨',
      services: [
        { name: 'Premium Restaurants', count: 1200 },
        { name: 'Luxury Hotels', count: 450 },
        { name: 'Wellness Spas', count: 320 }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      icon: '🏥',
      services: [
        { name: 'Hospitals', count: 580 },
        { name: 'Dental Clinics', count: 890 },
        { name: 'Specialty Care', count: 670 }
      ]
    },
    {
      id: 'education',
      title: 'Education & Training',
      icon: '🎓',
      services: [
        { name: 'Universities', count: 240 },
        { name: 'Vocational Schools', count: 350 },
        { name: 'Tutoring Centers', count: 780 }
      ]
    },
    {
      id: 'realestate',
      title: 'Real Estate',
      icon: '🏠',
      services: [
        { name: 'Residential Properties', count: 2400 },
        { name: 'Commercial Spaces', count: 890 },
        { name: 'Property Management', count: 340 }
      ]
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
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Discover & Connect with the Best Local Services</h1>
          <p>Your one-stop platform for finding trusted service providers in your area</p>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <div className={styles.locationInput}>
                <i className={styles.locationIcon}>📍</i>
                <input 
                  type="text" 
                  placeholder="Enter your location"
                  className={styles.locationField}
                />
              </div>
              
              <div className={styles.serviceInput}>
                <i className={styles.searchIcon}>🔍</i>
                <input 
                  type="text" 
                  placeholder="What service are you looking for?"
                  className={styles.searchField}
                />
              </div>
              
              <button className={styles.searchButton}>
                Search
              </button>
            </div>
            
            <div className={styles.popularSearches}>
              <span>Popular:</span>
              <Link to="/restaurants">Restaurants</Link>
              <Link to="/hotels">Hotels</Link>
              <Link to="/healthcare">Healthcare</Link>
              <Link to="/education">Education</Link>
            </div>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <h3>50K+</h3>
            <p>Listed Businesses</p>
          </div>
          <div className={styles.statItem}>
            <h3>100+</h3>
            <p>Categories</p>
          </div>
          <div className={styles.statItem}>
            <h3>1M+</h3>
            <p>Happy Users</p>
          </div>
        </div>
      </section>

      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Explore Categories</h2>
          <div className={styles.categoryFilters}>
            <button 
              className={`${styles.filterButton} ${activeCategory === 'all' ? styles.active : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Categories
            </button>
            <button 
              className={`${styles.filterButton} ${activeCategory === 'popular' ? styles.active : ''}`}
              onClick={() => setActiveCategory('popular')}
            >
              Most Popular
            </button>
            <button 
              className={`${styles.filterButton} ${activeCategory === 'trending' ? styles.active : ''}`}
              onClick={() => setActiveCategory('trending')}
            >
              Trending Now
            </button>
          </div>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map(category => (
            <div key={category.id} className={styles.categoryCard}>
              <div className={styles.categoryIcon}>{category.icon}</div>
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
                View All <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.viewAllContainer}>
          <Link to="/categories" className={styles.viewAllButton}>
            View All Categories
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✓</div>
            <h3>Verified Providers</h3>
            <p>All service providers undergo thorough verification for your peace of mind</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⭐</div>
            <h3>Real Reviews</h3>
            <p>Authentic reviews and ratings from verified customers</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure Booking</h3>
            <p>Safe and secure platform for all your transactions</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💬</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support for assistance</p>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>What Our Users Say</h2>
        <div className={styles.testimonialGrid}>
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
              <p className={styles.testimonialContent}>{testimonial.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to List Your Business?</h2>
          <p>Join thousands of businesses reaching new customers every day</p>
          <div className={styles.ctaButtons}>
            <Link to="/register" className={styles.primaryButton}>
              Get Started
            </Link>
            <Link to="/how-it-works" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <hr />
    </div>
  );
};

export default HomePage;