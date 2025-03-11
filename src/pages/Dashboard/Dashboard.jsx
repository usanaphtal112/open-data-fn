import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api/client';
import { endpoints } from '../../services/api/endpoints';
import { isAuthenticated } from '../../services/resources/auth';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Assuming you have a user profile endpoint
        const response = await apiClient.get(endpoints.user.profile);
        setUserData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className={styles.overviewTab}>
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <h3>Favorites</h3>
                <p className={styles.statValue}>{userData?.favorites_count || 0}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Reviews</h3>
                <p className={styles.statValue}>{userData?.reviews_count || 0}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Listed Businesses</h3>
                <p className={styles.statValue}>{userData?.businesses_count || 0}</p>
              </div>
            </div>
            
            <div className={styles.recentActivity}>
              <h3>Recent Activity</h3>
              {userData?.recent_activity?.length > 0 ? (
                <ul className={styles.activityList}>
                  {userData.recent_activity.map((activity, index) => (
                    <li key={index} className={styles.activityItem}>
                      <span className={styles.activityDate}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                      <span className={styles.activityText}>{activity.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyState}>No recent activity to display.</p>
              )}
            </div>
          </div>
        );
      
      case 'favorites':
        return (
          <div className={styles.favoritesTab}>
            <h3>Your Favorites</h3>
            {userData?.favorites?.length > 0 ? (
              <div className={styles.favoritesGrid}>
                {userData.favorites.map((item, index) => (
                  <div key={index} className={styles.favoriteCard}>
                    <div className={styles.favoriteImage}>
                      <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                    </div>
                    <div className={styles.favoriteInfo}>
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                      <div className={styles.favoriteRating}>
                        ★ {item.rating}/5 ({item.review_count} reviews)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>
                You haven't added any favorites yet. 
                <Link to="/" className={styles.actionLink}>Browse businesses</Link>
              </p>
            )}
          </div>
        );
      
      case 'reviews':
        return (
          <div className={styles.reviewsTab}>
            <h3>Your Reviews</h3>
            {userData?.reviews?.length > 0 ? (
              <div className={styles.reviewsList}>
                {userData.reviews.map((review, index) => (
                  <div key={index} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <h4>{review.business_name}</h4>
                      <div className={styles.reviewRating}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                    <p className={styles.reviewContent}>{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>
                You haven't written any reviews yet.
                <Link to="/" className={styles.actionLink}>Find places to review</Link>
              </p>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className={styles.settingsTab}>
            <h3>Account Settings</h3>
            <form className={styles.settingsForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  defaultValue={userData?.name || ''} 
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  defaultValue={userData?.email || ''} 
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  defaultValue={userData?.phone || ''} 
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Save Changes
                </button>
              </div>
            </form>
            
            <div className={styles.passwordSection}>
              <h3>Change Password</h3>
              <form className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <p>Welcome back, {userData?.name || 'User'}!</p>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.sidebar}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img src={userData?.avatar || '/default-avatar.png'} alt="User Avatar" />
            </div>
            <div className={styles.userName}>{userData?.name || 'User'}</div>
            <div className={styles.userEmail}>{userData?.email || 'user@example.com'}</div>
          </div>
          
          <nav className={styles.dashboardNav}>
            <button
              className={`${styles.navButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'favorites' ? styles.active : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
          
          <div className={styles.sidebarFooter}>
            <Link to="/" className={styles.homeLink}>Back to Home</Link>
          </div>
        </div>
        
        <div className={styles.mainContent}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;