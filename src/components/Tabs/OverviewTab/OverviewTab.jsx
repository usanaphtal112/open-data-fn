import React from 'react';
import styles from './OverviewTab.module.css';
import StatCard from '../../Activity/StatCard'
import ActivityItem from '../../Activity/ActivityItem'

const OverviewTab = ({ userData }) => {
  // Icons for the stat cards
  const favoriteIcon = <span>♥</span>;
  const reviewIcon = <span>★</span>;
  const businessIcon = <span>📋</span>;
  
  return (
    <div className={styles.overviewTab}>
      <h2 className={styles.tabTitle}>Dashboard Overview</h2>
      
      <div className={styles.statsContainer}>
        <StatCard 
          title="Favorites" 
          value={userData?.favorites_count || 0} 
          icon={favoriteIcon}
          color="#E83E8C"
        />
        <StatCard 
          title="Reviews" 
          value={userData?.reviews_count || 0} 
          icon={reviewIcon}
          color="#FFC107"
        />
        
        {/* Show businesses count only for business accounts */}
        {userData?.role === 'BUSINESS' && (
          <StatCard 
            title="My Listings" 
            value={userData?.businesses_count || 0} 
            icon={businessIcon}
            color="#28A745"
          />
        )}
        
        {/* Show additional admin stats */}
        {userData?.role === 'ADMIN' && (
          <>
            <StatCard 
              title="Total Users" 
              value={userData?.total_users || 0} 
              icon={<span>👥</span>}
              color="#20C997"
            />
            <StatCard 
              title="Pending Reviews" 
              value={userData?.pending_reviews || 0} 
              icon={<span>⏱</span>}
              color="#FD7E14"
            />
          </>
        )}
      </div>
      
      <div className={styles.recentActivity}>
        <h3>Recent Activity</h3>
        {userData?.recent_activity?.length > 0 ? (
          <ul className={styles.activityList}>
            {userData.recent_activity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>No recent activity to display.</p>
        )}
      </div>
      
      {/* Role-specific sections */}
      {userData?.role === 'BUSINESS' && (
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Add New Listing</button>
            <button className={styles.actionButton}>View Analytics</button>
            <button className={styles.actionButton}>Manage Reviews</button>
          </div>
        </div>
      )}
      
      {userData?.role === 'ADMIN' && (
        <div className={styles.adminStats}>
          <h3>System Status</h3>
          <div className={styles.adminStatsGrid}>
            <div className={styles.adminStatItem}>
              <div className={styles.adminStatValue}>
                {userData?.system_stats?.listings_today || 0}
              </div>
              <div className={styles.adminStatLabel}>New Listings Today</div>
            </div>
            <div className={styles.adminStatItem}>
              <div className={styles.adminStatValue}>
                {userData?.system_stats?.reviews_today || 0}
              </div>
              <div className={styles.adminStatLabel}>New Reviews Today</div>
            </div>
            <div className={styles.adminStatItem}>
              <div className={styles.adminStatValue}>
                {userData?.system_stats?.users_today || 0}
              </div>
              <div className={styles.adminStatLabel}>New Users Today</div>
            </div>
            <div className={styles.adminStatItem}>
              <div className={styles.adminStatValue}>
                {userData?.system_stats?.reports_today || 0}
              </div>
              <div className={styles.adminStatLabel}>Content Reports</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;