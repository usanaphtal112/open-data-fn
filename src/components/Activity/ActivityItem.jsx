import React from 'react';
import styles from './ActivityItem.module.css';

const ActivityItem = ({ activity }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'review':
        return '★';
      case 'favorite':
        return '♥';
      case 'listing':
        return '📋';
      case 'comment':
        return '💬';
      default:
        return '•';
    }
  };

  return (
    <li className={styles.activityItem}>
      <div className={styles.activityIconContainer}>
        <span className={styles.activityIcon}>
          {getActivityIcon(activity.type)}
        </span>
      </div>
      <div className={styles.activityContent}>
        <div className={styles.activityText}>{activity.description}</div>
        <div className={styles.activityMeta}>
          <span className={styles.activityDate}>{formatDate(activity.timestamp)}</span>
          {activity.businessName && (
            <span className={styles.activityBusiness}>{activity.businessName}</span>
          )}
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;