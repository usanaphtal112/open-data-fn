
import React, { useState } from "react";
import { registerUser } from "../../services/api/client";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Only check password confirmation (backend handles the rest)
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(formData);
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Register your account</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Middle Name (Optional)</label>
            <input
              type="text"
              name="middle_name"
              placeholder="Enter middle name"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.alert} style={{ color: "red" }}>{error}</div>}
          {success && <div className={styles.alert} style={{ color: "green" }}>Registration successful! Redirecting to login...</div>}

          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
