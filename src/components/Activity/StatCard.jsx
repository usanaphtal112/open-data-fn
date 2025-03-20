import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={styles.statCard} style={{ '--stat-color': color || 'var(--accent-color)' }}>
      {icon && <div className={styles.statIcon}>{icon}</div>}
      <div className={styles.statInfo}>
        <h3>{title}</h3>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;