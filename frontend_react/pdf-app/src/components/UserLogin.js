
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';

// UserLogin component
const UserLogin = ({ setAuthenticated }) => {
  const navigate = useNavigate();

  // Handler for navigation to the registration page
  const handleRegistrationClick = () => {
    // Navigate to the registration page when the button is clicked
    navigate('/registration');
  };
  // State to manage form data (email and password)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // Handler for input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server for user login
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // Check if the login was successful
      if (response.ok) {
        // Login successful
        setAuthenticated(true);
        console.log('Login worked');
        navigate('/upload');
      } else {
        // Login failed
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  // Render the user login form
  return (
    <div className={styles['user-login-container']}>
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Login</button>

        <button type="button" onClick={handleRegistrationClick}>
          Go to Registration
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
