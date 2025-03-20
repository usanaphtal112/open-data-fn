import React from 'react';
import styles from './UserProfile.module.css';

const UserProfile = ({ userData }) => {
  // Function to get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'BUSINESS_OWNER':
        return 'Business Owner';
      case 'USER':
        return 'User';
      default:
        return 'User';
    }
  };

  // Get user avatar or default
  const avatarSrc = userData?.profile_image || '/default-avatar.png';
  
  // Get user role for display
  const roleDisplay = getRoleDisplay(userData?.role);

  return (
    <div className={styles.userProfile}>
      <div className={styles.userAvatar}>
        <img src={avatarSrc} alt="User Avatar" />
        <div className={styles.roleIndicator} title={roleDisplay}>
          {userData?.role?.charAt(0) || 'U'}
        </div>
      </div>
      <div className={styles.userName}>{userData?.first_name || 'User'}</div>
      <div className={styles.userEmail}>{userData?.email || 'user@example.com'}</div>
      <div className={styles.userRole}>{roleDisplay}</div>
    </div>
  );
};

export default UserProfile;