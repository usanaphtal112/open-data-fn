import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.css';
import { registerUser } from '../../services/resources/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    password: '',
    confirm_password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await registerUser(formData);
      
      // If we get here, registration was successful
      setLoading(false);
      navigate('/registration-success');
    } catch (error) {
      setLoading(false);
      
      if (error.response) {
        const { data, status } = error.response;
        
        if (status === 400) {
          // Handle validation errors from backend
          if (data.detail) {
            setServerError(data.detail);
          } else {
            // Format backend errors to match our error state structure
            const backendErrors = {};
            
            Object.keys(data).forEach(key => {
              if (key === 'non_field_errors') {
                setServerError(data[key][0]);
              } else {
                backendErrors[key] = data[key][0];
              }
            });
            
            setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
          }
        } else if (status === 409) {
          // Email already exists
          setErrors(prevErrors => ({ 
            ...prevErrors, 
            email: data.email || 'This email is already registered'
          }));
        } else {
          setServerError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setServerError('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.leftPanel}>
        <div className={styles.statsContainer}>
          {/* This is where the 3D character and stats from the image would go */}
          <div className={styles.illustration}>
            <img
              src="/hero_illustration.png"
              alt="3D Character with Stats"
              className={styles.characterImage}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>

          <div className={styles.logo}>
            <img src="/logo.svg" alt="Logo" className={styles.logoImage} /> 
          </div>


          
          <h1 className={styles.title}>Welcome to DiverseDataHub 👋</h1>
          <p className={styles.subtitle}>
            Please create an account to access comprehensive data across various sectors
          </p>
          
          {serverError && (
            <div className={styles.serverError}>
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={errors.first_name ? styles.inputError : ''}
                  placeholder="Enter your first name"
                />
                {errors.first_name && <div className={styles.errorText}>{errors.first_name}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="middle_name">Middle Name (Optional)</label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className={errors.middle_name ? styles.inputError : ''}
                  placeholder="Enter your middle name"
                />
                {errors.middle_name && <div className={styles.errorText}>{errors.middle_name}</div>}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? styles.inputError : ''}
                  placeholder="Enter your last name"
                />
                {errors.last_name && <div className={styles.errorText}>{errors.last_name}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.inputError : ''}
                  placeholder="Enter your email address"
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password *</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.inputError : ''}
                    placeholder="Enter your password"
                  />
                  <i
                      className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} ${styles.eyeIcon}`}
                      onClick={() => togglePasswordVisibility("password")}
                    >
                    </i>
                  {/* Eye icon for password visibility toggle could go here */}
                </div>
                {errors.password && <div className={styles.errorText}>{errors.password}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirm_password">Confirm Password *</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={errors.confirm_password ? styles.inputError : ''}
                    placeholder="Repeat your password"
                  />
                  <i
                      className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"} ${styles.eyeIcon}`}
                      onClick={() => togglePasswordVisibility("confirm_password")}
                    >
                    </i>
                  {/* Eye icon for password visibility toggle could go here */}
                </div>
                {errors.confirm_password && <div className={styles.errorText}>{errors.confirm_password}</div>}
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.registerButton}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            
            <div className={styles.loginLink}>
              Already have an account? <a href="/login">Sign in</a>
            </div>
          </form>
          
          <div className={styles.socialLogin}>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            
            <div className={styles.socialButtons}>
              <button className={`${styles.socialButton} ${styles.facebookButton}`}>
              <FaFacebook size={24} />
                <span className={styles.facebookIcon}></span>
              </button>
              <button className={`${styles.socialButton} ${styles.twitterButton}`}>
              <FaTwitter size={24} />
                <span className={styles.twitterIcon}></span>
              </button>
              <button className={`${styles.socialButton} ${styles.linkedinButton}`}>
              <FaLinkedin size={24} />
                <span className={styles.linkedinIcon}></span>
              </button>
              <button className={`${styles.socialButton} ${styles.instagramButton}`}>
              <FaInstagram size={24} />
                <span className={styles.instagramIcon}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;