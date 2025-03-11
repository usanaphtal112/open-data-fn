import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { loginUser } from '../../services/resources/auth';
import { useTheme } from '../../contexts/ThemeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        remember_me: formData.remember_me
      });
      
      // If we get here, login was successful
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      
      if (error.response) {
        const { data, status } = error.response;
        
        if (status === 400 || status === 401) {
          // Handle validation errors from backend
          if (data.detail) {
            setServerError(data.detail);
          } else if (typeof data === 'string') {
            setServerError(data);
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
        } else {
          setServerError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setServerError('Network error. Please check your connection and try again.');
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <img src="/logo.svg" alt="Logo" className={styles.logoImage} />
          </div>
          
          <h1 className={styles.title}>Welcome Back 👋</h1>
          <p className={styles.subtitle}>
            Log in to your account to access your personalized dashboard
          </p>
          
          {serverError && (
            <div className={styles.serverError}>
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ''}
                placeholder="Enter your registered email"
              />
              {errors.email && <div className={styles.errorText}>{errors.email}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password">Password</label>
                <span className={styles.forgotPassword} onClick={handleForgotPassword}>
                  Forgot password?
                </span>
              </div>
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
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              {errors.password && <div className={styles.errorText}>{errors.password}</div>}
            </div>
            
            <div className={styles.rememberMeContainer}>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="remember_me"
                  checked={formData.remember_me}
                  onChange={handleChange}
                />
                <span className={styles.checkmark}></span>
                <span>Remember me</span>
              </label>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
            
            <div className={styles.registerLink}>
              Don't have an account? <a href="/register">Sign up</a>
            </div>
          </form>
          
          <div className={styles.socialLogin}>
            <div className={styles.divider}>
              <span>or continue with</span>
            </div>
            
            <div className={styles.socialButtons}>
              <button className={`${styles.socialButton} ${styles.facebookButton}`}>
                <i className="bi bi-facebook"></i>
              </button>
              <button className={`${styles.socialButton} ${styles.twitterButton}`}>
                <i className="bi bi-twitter"></i>
              </button>
              <button className={`${styles.socialButton} ${styles.githubButton}`}>
                <i className="bi bi-github"></i>
              </button>
              <button className={`${styles.socialButton} ${styles.googleButton}`}>
                <i className="bi bi-google"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.illustrationContainer}>
          <div className={styles.illustration}>
            <img
              src="/hero_illustration.png"
              alt="3D Character with Stats"
              className={styles.characterImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;