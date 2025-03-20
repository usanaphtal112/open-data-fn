import React from 'react';
import styles from './RoleTabs.module.css';

const RoleTabs = ({ userData, activeTab, setActiveTab }) => {
  // Define tabs for different user roles
  const getTabs = () => {
    // Common tabs for all users
    const commonTabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'favorites', label: 'Favorites' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'settings', label: 'Settings' }
    ];
    
    // Business owner specific tabs
    const businessTabs = [
      { id: 'businessListings', label: 'My Listings' },
      { id: 'analytics', label: 'Analytics' }
    ];
    
    // Admin specific tabs
    const adminTabs = [
      { id: 'userManagement', label: 'User Management' },
      { id: 'contentModeration', label: 'Content Moderation' }
    ];
    
    // Return appropriate tabs based on user role
    switch (userData?.role) {
      case 'ADMIN':
        return [...commonTabs, ...adminTabs];
      case 'BUSINESS_OWNER':
        return [...commonTabs, ...businessTabs];
      default:
        return commonTabs;
    }
  };
  
  // Get tabs based on user role
  const tabs = getTabs();
  
  return (
    <nav className={styles.dashboardNav}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default RoleTabs;