
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationSuccessPage.module.css';

const RegistrationSuccessPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          ✓
        </div>
        <h1 className={styles.title}>Registration Successful!</h1>
        <p className={styles.message}>
          Your account has been created successfully. Welcome to the Rwanda Data Platform.
        </p>
        <p className={styles.submessage}>
          You can now access comprehensive data across various sectors including Restaurants,
          Hotels, Beauty Spas, Education, Health Services, and more.
        </p>
        <button 
          className={styles.loginButton}
          onClick={() => navigate('/login')}
        >
          Proceed to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;