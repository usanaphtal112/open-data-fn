import React from 'react';
import styles from './DashboardSkeleton.module.css';

const DashboardSkeleton = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerTitleSkeleton}></div>
        <div className={styles.headerSubtitleSkeleton}></div>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.sidebar}>
          {/* User Profile Skeleton */}
          <div className={styles.userProfileSkeleton}>
            <div className={styles.avatarSkeleton}></div>
            <div className={styles.nameSkeleton}></div>
            <div className={styles.roleSkeleton}></div>
          </div>
          
          {/* Role Tabs Skeleton */}
          <div className={styles.tabsSkeleton}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className={styles.tabItemSkeleton}></div>
            ))}
          </div>
          
          <div className={styles.sidebarFooter}>
            <div className={styles.linkSkeleton}></div>
          </div>
        </div>
        
        <div className={styles.mainContent}>
          {/* Main Content Skeleton */}
          <div className={styles.contentSkeleton}>
            <div className={styles.contentHeaderSkeleton}></div>
            <div className={styles.contentItemsContainer}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={styles.contentItemSkeleton}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;