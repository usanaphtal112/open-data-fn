import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api/client';
import { endpoints } from '../../../services/api/endpoints';
import styles from './SettingsTab.module.css';

const SettingsTab = ({ userData }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    profilePicture: userData?.profilePicture || '',
    notificationPreferences: {
      email: userData?.notificationPreferences?.email || false,
      push: userData?.notificationPreferences?.push || false,
      sms: userData?.notificationPreferences?.sms || false
    },
    theme: localStorage.getItem('theme') || 'light',
    language: userData?.language || 'en'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Special settings based on user role
  const [roleSpecificSettings, setRoleSpecificSettings] = useState({});
  
  useEffect(() => {
    // Fetch any additional user settings if needed
    const fetchUserSettings = async () => {
      try {
        // You may want to fetch additional settings data
        if (userData?.role === 'BUSINESS_OWNER') {
          const response = await apiClient.get(endpoints.business.settings);
          setRoleSpecificSettings(response.data);
        } else if (userData?.role === 'ADMIN') {
          const response = await apiClient.get(endpoints.admin.settings);
          setRoleSpecificSettings(response.data);
        }
      } catch (err) {
        console.error('Error fetching additional settings:', err);
      }
    };
    
    fetchUserSettings();
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (like notification preferences)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Update profile data
      await apiClient.put(endpoints.user.updateProfile, formData);
      
      // Handle theme change
      if (formData.theme !== localStorage.getItem('theme')) {
        localStorage.setItem('theme', formData.theme);
        document.body.classList.toggle('dark-mode', formData.theme === 'dark');
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Reset messages after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Update password
      await apiClient.put(endpoints.user.updatePassword, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset messages after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render content specific to business owners
  const renderBusinessOwnerSettings = () => {
    if (userData?.role !== 'BUSINESS_OWNER') return null;
    
    return (
      <div className={styles.settingsSection}>
        <h3>Business Settings</h3>
        <div className={styles.formGroup}>
          <label>Business Notification Preferences</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="businessNotifications.newReviews"
                checked={roleSpecificSettings?.businessNotifications?.newReviews || false}
                onChange={handleChange}
              />
              Notify me of new reviews
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="businessNotifications.bookings"
                checked={roleSpecificSettings?.businessNotifications?.bookings || false}
                onChange={handleChange}
              />
              Notify me of new bookings
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Render content specific to admins
  const renderAdminSettings = () => {
    if (userData?.role !== 'ADMIN') return null;
    
    return (
      <div className={styles.settingsSection}>
        <h3>Admin Settings</h3>
        <div className={styles.formGroup}>
          <label>Admin Notification Preferences</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="adminNotifications.userReports"
                checked={roleSpecificSettings?.adminNotifications?.userReports || false}
                onChange={handleChange}
              />
              Notify me of user reports
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="adminNotifications.contentFlags"
                checked={roleSpecificSettings?.adminNotifications?.contentFlags || false}
                onChange={handleChange}
              />
              Notify me of flagged content
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h2>Account Settings</h2>
        <p>Manage your account preferences and profile information</p>
      </div>
      
      {/* Profile Settings Section */}
      <div className={styles.settingsSection}>
        <h3>Profile Information</h3>
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        
        <form onSubmit={handleProfileUpdate}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="profilePicture">Profile Picture URL</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className={styles.input}
            />
            {formData.profilePicture && (
              <div className={styles.profileImagePreview}>
                <img 
                  src={formData.profilePicture} 
                  alt="Profile Preview" 
                  className={styles.previewImage}
                  onError={(e) => e.target.src = '/assets/default-avatar.png'}
                />
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Notification Preferences</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notificationPreferences.email"
                  checked={formData.notificationPreferences.email}
                  onChange={handleChange}
                />
                Email Notifications
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notificationPreferences.push"
                  checked={formData.notificationPreferences.push}
                  onChange={handleChange}
                />
                Push Notifications
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notificationPreferences.sms"
                  checked={formData.notificationPreferences.sms}
                  onChange={handleChange}
                />
                SMS Notifications
              </label>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      {/* Password Change Section */}
      <div className={styles.settingsSection}>
        <h3>Change Password</h3>
        {passwordSuccess && <div className={styles.successMessage}>{passwordSuccess}</div>}
        {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
        
        <form onSubmit={handlePasswordChange}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              className={styles.input}
              required
              minLength="8"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className={styles.input}
              required
              minLength="8"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
      
      {/* Render role-specific settings */}
      {renderBusinessOwnerSettings()}
      {renderAdminSettings()}
      
      {/* Account Deletion Section */}
      <div className={styles.settingsSection}>
        <h3>Danger Zone</h3>
        <p className={styles.dangerText}>Once you delete your account, there is no going back. Please be certain.</p>
        <button className={styles.dangerButton}>Delete Account</button>
      </div>
    </div>
  );
};

export default SettingsTab;