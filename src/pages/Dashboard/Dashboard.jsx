import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api/client';
import { endpoints } from '../../services/api/endpoints';
import { isAuthenticated } from '../../services/resources/auth';
import styles from './Dashboard.module.css';

// Component imports
import UserProfile from '../../components/UserProfile/UserProfile';
import RoleTabs from '../../components/RoleTabs/RoleTabs';
import OverviewTab from '../../components/Tabs/OverviewTab/OverviewTab';
import FavoritesTab from '../../components/Tabs/FavoritesTab/FavoritesTab';
import ReviewsTab from '../../components/Tabs/ReviewsTab/ReviewsTab';
import SettingsTab from '../../components/Tabs/SettingsTab/SettingsTab';
import BusinessListingsTab from '../../components/Tabs/BusinessListingsTab/BusinessListingsTab';
import AnalyticsTab from '../../components/Tabs/AnalyticsTab/AnalyticsTab';
import UserManagementTab from '../../components/Tabs/UserManagementTab/UserManagementTab';
import ContentModerationTab from '../../components/Tabs/ContentModerationTab/ContentModerationTab';

//Pages Dashboard import
import DashboardSkeleton from './DashboardSkeleton/DashboardSkeleton';

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
        
        // Set default active tab based on user role
        if (response.data.role === 'ADMIN') {
          setActiveTab('userManagement');
        } else if (response.data.role === 'BUSINESS_OWNER') {
          setActiveTab('businessListings');
        }
        
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
        return <OverviewTab userData={userData} />;
      
      case 'favorites':
        return <FavoritesTab userData={userData} />;
      
      case 'reviews':
        return <ReviewsTab userData={userData} />;
      
      case 'settings':
        return <SettingsTab userData={userData} />;
      
      case 'businessListings':
        return userData?.role === 'BUSINESS_OWNER' ? 
          <BusinessListingsTab userData={userData} /> : 
          <div className={styles.unauthorizedMessage}>You don't have access to this section.</div>;
      
      case 'analytics':
        return userData?.role === 'BUSINESS_OWNER' ? 
          <AnalyticsTab userData={userData} /> : 
          <div className={styles.unauthorizedMessage}>You don't have access to this section.</div>;
      
      case 'userManagement':
        return userData?.role === 'ADMIN' ? 
          <UserManagementTab userData={userData} /> : 
          <div className={styles.unauthorizedMessage}>You don't have access to this section.</div>;
      
      case 'contentModeration':
        return userData?.role === 'ADMIN' ? 
          <ContentModerationTab userData={userData} /> : 
          <div className={styles.unauthorizedMessage}>You don't have access to this section.</div>;
      
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
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
        <p>Welcome back, {userData?.first_name || 'User'}!</p>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.sidebar}>
          <UserProfile userData={userData} />
          
          <RoleTabs 
            userData={userData} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
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