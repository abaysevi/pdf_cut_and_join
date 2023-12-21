// src/components/UserLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';

const UserLogin = ({setAuthenticated}) => {
  const navigate = useNavigate();


  const handleRegistrationClick = () => {
    // Navigate to the registration page when the button is clicked
    navigate('/registration');
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to send login data to the backend
    console.log('Login Data:', formData);
    setAuthenticated(true);
    console.log("login worked");
    navigate('/upload');
  };

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
