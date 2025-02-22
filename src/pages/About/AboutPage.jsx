
import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.aboutPage}>
      <header className={styles.aboutHeader}>
        <h1>About DiverseDataHub</h1>
        <p>Connecting communities with quality services since 2024</p>
      </header>

      <section className={styles.mission}>
        <div className={styles.container}>
          <h2>Our Mission</h2>
          <p>
            At DiverseDataHub, we're committed to revolutionizing how people discover and connect with local services. 
            We believe in creating a seamless bridge between service providers and customers, ensuring quality, 
            reliability, and satisfaction in every interaction.
          </p>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.container}>
          <h2>Our Values</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <h3>Quality</h3>
              <p>We maintain high standards for all listed service providers</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Trust</h3>
              <p>Building reliable connections between providers and customers</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Innovation</h3>
              <p>Continuously improving our platform for better user experience</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Community</h3>
              <p>Supporting local businesses and strengthening communities</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.container}>
          <h2>Our Story</h2>
          <div className={styles.storyContent}>
            <p>
              Founded with a vision to simplify service discovery, DiverseDataHub has grown from 
              a small directory to a comprehensive platform serving thousands of users. Our journey 
              is driven by the desire to create meaningful connections and support local businesses 
              while providing consumers with easy access to quality services.
            </p>
            <p>
              Today, we're proud to host a wide range of service providers across multiple 
              categories, from hospitality to healthcare, education to home services. Our platform 
              continues to evolve, incorporating user feedback and technological advancements to 
              better serve our community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;