import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

// Component for Search Section with improved autocomplete
const SearchBar = () => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [serviceSuggestions, setServiceSuggestions] = useState([]);
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  // Mock suggestions - in production these would come from an API
  const mockLocations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
  const mockServices = ['Restaurants', 'Hotels', 'Beauty Spa', 'Home Décor', 'Wedding Planning', 'Education'];

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    
    if (value.length > 1) {
      const filtered = mockLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setService(value);
    
    if (value.length > 1) {
      const filtered = mockServices.filter(svc => 
        svc.toLowerCase().includes(value.toLowerCase())
      );
      setServiceSuggestions(filtered);
      setShowServiceSuggestions(true);
    } else {
      setShowServiceSuggestions(false);
    }
  };

  const selectLocation = (loc) => {
    setLocation(loc);
    setShowLocationSuggestions(false);
  };

  const selectService = (svc) => {
    setService(svc);
    setShowServiceSuggestions(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <div className={styles.locationInput}>
          <i className={`${styles.locationIcon} bi bi-geo-alt`}></i>
          <div className={styles.inputWithSuggestions}>
            <input 
              type="text" 
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter your location"
              className={styles.locationField}
              aria-label="Location"
            />
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {locationSuggestions.map((loc, index) => (
                  <li key={index} onClick={() => selectLocation(loc)}>
                    <i className="bi bi-geo-alt-fill"></i> {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className={styles.serviceInput}>
          <i className={`${styles.searchIcon} bi bi-search`}></i>
          <div className={styles.inputWithSuggestions}>
            <input 
              type="text"
              value={service}
              onChange={handleServiceChange}
              placeholder="What service are you looking for?"
              className={styles.searchField}
              aria-label="Service search"
            />
            {showServiceSuggestions && serviceSuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {serviceSuggestions.map((svc, index) => (
                  <li key={index} onClick={() => selectService(svc)}>
                    {svc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <button className={styles.searchButton} aria-label="Search">
          <span>Search</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
      
      <div className={styles.popularSearches}>
        <span>Popular:</span>
        {['Restaurants', 'Hotels', 'Healthcare', 'Education', 'Real Estate'].map(item => (
          <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} className={styles.popularLink}>
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

// Component for Stats Display with animation
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

// Enhanced Category Card with hover effect and icon animation
const CategoryCard = ({ category }) => {
  return (
    <motion.div 
      className={styles.categoryCard}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className={styles.categoryIconWrapper}>
        <motion.div 
          className={styles.categoryIcon} 
          aria-hidden="true"
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          <i className={`bi ${category.iconClass}`}></i>
        </motion.div>
        {category.trending && (
          <span className={styles.trendingBadge}>
            <i className="bi bi-graph-up-arrow"></i> Trending
          </span>
        )}
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

// Enhanced Feature Card with interactive elements
const FeatureCard = ({ feature }) => {
  return (
    <motion.div 
      className={styles.featureCard}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <motion.div 
        className={styles.featureIcon}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <i className={`bi ${feature.iconClass}`}></i>
      </motion.div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      {feature.link && (
        <Link to={feature.link} className={styles.learnMoreLink}>
          Learn more <i className="bi bi-arrow-right"></i>
        </Link>
      )}
    </motion.div>
  );
};

// Enhanced Testimonial Card with rating display
const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div 
      className={styles.testimonialCard}
      whileHover={{ y: -5 }}
    >
      <div className={styles.testimonialRating}>
        {[...Array(5)].map((_, i) => (
          <i key={i} className={i < testimonial.rating ? "bi bi-star-fill" : "bi bi-star"} aria-hidden="true"></i>
        ))}
        <span className={styles.ratingText}>{testimonial.rating}.0</span>
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

// New Component: Featured Listings Carousel
const FeaturedListings = ({ listings }) => {
  return (
    <div className={styles.featuredListings}>
      <div className={styles.listingsHeader}>
        <h3>Featured Listings</h3>
        <div className={styles.listingsControls}>
          <button className={styles.listingControl} aria-label="Previous listings">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className={styles.listingControl} aria-label="Next listings">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className={styles.listingsCarousel}>
        {listings.map(listing => (
          <motion.div 
            key={listing.id} 
            className={styles.listingCard}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
          >
            <div className={styles.listingImage}>
              <img src={listing.image} alt={listing.name} loading="lazy" />
              {listing.featured && <span className={styles.featuredBadge}>Featured</span>}
            </div>
            <div className={styles.listingInfo}>
              <div className={styles.listingMeta}>
                <span className={styles.listingCategory}>
                  <i className={`bi ${listing.categoryIcon}`}></i> {listing.category}
                </span>
                <span className={styles.listingRating}>
                  <i className="bi bi-star-fill"></i> {listing.rating}
                </span>
              </div>
              <h4>{listing.name}</h4>
              <p className={styles.listingLocation}>
                <i className="bi bi-geo-alt"></i> {listing.location}
              </p>
              <Link to={`/listing/${listing.id}`} className={styles.viewListingLink}>
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// New Component: Category Explorer
const CategoryExplorer = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className={styles.categoryExplorer}>
      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${activeCategory === category.id ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <i className={`bi ${category.iconClass}`}></i>
            <span>{category.title}</span>
          </button>
        ))}
      </div>
      
      <div className={styles.subcategories}>
        {categories.find(cat => cat.id === activeCategory)?.subcategories?.map(subcat => (
          <Link key={subcat.id} to={`/categories/${activeCategory}/${subcat.id}`} className={styles.subcategoryLink}>
            {subcat.name} <span>{subcat.count}+</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState('hospitality');
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
    { value: '1M+', label: 'Happy Users' },
    { value: '4.8', label: 'Average Rating' }
  ];

  const categories = [
    {
      id: 'hospitality',
      title: 'Hospitality & Dining',
      iconClass: 'bi-buildings',
      trending: true,
      services: [
        { name: 'Premium Restaurants', count: 1200 },
        { name: 'Luxury Hotels', count: 450 },
        { name: 'Wellness Spas', count: 320 }
      ],
      subcategories: [
        { id: 'restaurants', name: 'Restaurants', count: 1200 },
        { id: 'hotels', name: 'Hotels', count: 450 },
        { id: 'cafes', name: 'Cafes & Lounges', count: 680 },
        { id: 'bars', name: 'Bars & Nightlife', count: 320 },
        { id: 'spas', name: 'Spas & Wellness', count: 240 }
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
      ],
      subcategories: [
        { id: 'hospitals', name: 'Hospitals', count: 580 },
        { id: 'dental', name: 'Dental Clinics', count: 890 },
        { id: 'specialty', name: 'Specialty Care', count: 670 },
        { id: 'mental-health', name: 'Mental Health', count: 410 }
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
      ],
      subcategories: [
        { id: 'universities', name: 'Universities', count: 240 },
        { id: 'schools', name: 'Schools', count: 520 },
        { id: 'vocational', name: 'Vocational Training', count: 350 },
        { id: 'tutoring', name: 'Tutoring & Coaching', count: 780 }
      ]
    },
    {
      id: 'realestate',
      title: 'Real Estate',
      iconClass: 'bi-house-door',
      trending: true,
      services: [
        { name: 'Residential Properties', count: 2400 },
        { name: 'Commercial Spaces', count: 890 },
        { name: 'Property Management', count: 340 }
      ],
      subcategories: [
        { id: 'residential', name: 'Residential', count: 2400 },
        { id: 'commercial', name: 'Commercial', count: 890 },
        { id: 'rental', name: 'Rental Properties', count: 1560 },
        { id: 'agents', name: 'Estate Agents', count: 720 }
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
      ],
      subcategories: [
        { id: 'repair', name: 'Auto Repair', count: 1150 },
        { id: 'dealerships', name: 'Dealerships', count: 620 },
        { id: 'rentals', name: 'Car Rentals', count: 380 },
        { id: 'parts', name: 'Auto Parts', count: 540 }
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
      ],
      subcategories: [
        { id: 'legal', name: 'Legal Services', count: 950 },
        { id: 'financial', name: 'Financial Services', count: 780 },
        { id: 'marketing', name: 'Marketing', count: 560 },
        { id: 'consulting', name: 'Consulting', count: 420 }
      ]
    }
  ];

  const features = [
    {
      title: 'Verified Providers',
      description: 'All service providers undergo thorough verification for your peace of mind',
      iconClass: 'bi-check-circle',
      link: '/how-it-works#verification'
    },
    {
      title: 'Real Reviews',
      description: 'Authentic reviews and ratings from verified customers',
      iconClass: 'bi-star',
      link: '/reviews'
    },
    {
      title: 'Secure Booking',
      description: 'Safe and secure platform for all your transactions',
      iconClass: 'bi-shield-lock',
      link: '/security'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for assistance',
      iconClass: 'bi-headset',
      link: '/support'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Restaurant Owner',
      image: '/man.png',
      rating: 5,
      content: 'DiverseDataHub has transformed how we connect with customers. Our bookings have increased by 60% since joining the platform.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Healthcare Provider',
      image: '/man.png',
      rating: 5,
      content: "The platform's seamless integration and user-friendly interface have made it easier for patients to find and book appointments with us."
    },
    {
      id: 3,
      name: 'Amanda Williams',
      role: 'Event Planner',
      image: '/man.png',
      rating: 4,
      content: 'As an event planner, having access to such a diverse range of vendors in one place has streamlined my workflow significantly.'
    }
  ];

  const featuredListings = [
    {
      id: 1,
      name: 'Skyline Restaurant & Lounge',
      category: 'Restaurant',
      categoryIcon: 'bi-cup-hot',
      image: '/api/placeholder/400/250',
      rating: 4.8,
      location: 'Downtown, New York',
      featured: true
    },
    {
      id: 2,
      name: 'Grand Plaza Hotel',
      category: 'Hotel',
      categoryIcon: 'bi-building',
      image: '/api/placeholder/400/250',
      rating: 4.9,
      location: 'Central District, Chicago',
      featured: true
    },
    {
      id: 3,
      name: 'Wellness Retreat Spa',
      category: 'Spa',
      categoryIcon: 'bi-water',
      image: '/api/placeholder/400/250',
      rating: 4.7,
      location: 'Beverly Hills, Los Angeles',
      featured: false
    },
    {
      id: 4,
      name: 'Elite Medical Center',
      category: 'Hospital',
      categoryIcon: 'bi-heart-pulse',
      image: '/api/placeholder/400/250',
      rating: 4.6,
      location: 'Memorial Area, Houston',
      featured: false
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
            Find the Perfect Local Services for Your Needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover, connect, and engage with trusted service providers in your area
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

      {/* Featured Listings Section */}
      <section className={styles.featuredSection}>
        <div className={styles.containerWrapper}>
          <FeaturedListings listings={featuredListings} />
        </div>
      </section>

      {/* Categories Section with Improved Filtering and Explorer */}
      <section className={styles.categories} id="categories">
        <div className={styles.containerWrapper}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Explore Categories</h2>
              <p className={styles.sectionSubtitle}>Find the service you need from our extensive collection of categories</p>
            </div>
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

          <CategoryExplorer 
            categories={categories} 
            activeCategory={activeCategoryTab} 
            setActiveCategory={setActiveCategoryTab} 
          />

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
              // Actual content - filter based on selected category
              categories
                .filter(cat => 
                  activeCategory === 'all' ? true : 
                  activeCategory === 'trending' ? cat.trending : 
                  // For 'popular', we could add a popular flag or use some metric
                  true
                )
                .map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))
            )}
          </div>

          <div className={styles.viewAllContainer}>
            <Link to="/categories" className={styles.viewAllButton}>
              View All Categories <i className="bi bi-arrow-right-circle"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.containerWrapper}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Why Choose Our Platform</h2>
              <p className={styles.sectionSubtitle}>Discover the benefits of using DiverseDataHub for all your service needs</p>
            </div>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className={styles.appDownload}>
        <div className={styles.containerWrapper}>
          <div className={styles.appContent}>
            <div className={styles.appText}>
              <h2>Get Our Mobile App</h2>
              <p>Find and book services on the go with our easy-to-use mobile application</p>
              <ul className={styles.appFeatures}>
                <li><i className="bi bi-check-circle-fill"></i> Quick service discovery</li>
                <li><i className="bi bi-check-circle-fill"></i> Real-time booking updates</li>
                <li><i className="bi bi-check-circle-fill"></i> Save your favorite providers</li>
                <li><i className="bi bi-check-circle-fill"></i> Exclusive mobile deals</li>
              </ul>
              <div className={styles.appButtons}>
                <a href="#" className={styles.appButton}>
                  <i className="bi bi-apple"></i> App Store
                </a>
                <a href="#" className={styles.appButton}>
                  <i className="bi bi-google-play"></i> Google Play
                </a>
              </div>
            </div>
            <div className={styles.appImage}>
              <img src="/api/placeholder/300/600" alt="Mobile app screenshot" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.containerWrapper}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>What Our Users Say</h2>
              <p className={styles.sectionSubtitle}>Hear from businesses and customers who use our platform</p>
            </div>
          </div>
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
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className={styles.cta}>
        <div className={styles.containerWrapper}>
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
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <div className={styles.containerWrapper}>
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterText}>
              <h2>Stay Updated</h2>
              <p>Subscribe to our newsletter for the latest service providers and exclusive offers</p>
            </div>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;