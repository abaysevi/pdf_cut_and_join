// src/components/UserRegistration.js
import React, { useState } from 'react';
import RegistrationStyles from  './UserRegistration.module.css';
import { useNavigate} from 'react-router-dom';


const UserRegistration = () => {
  const navigate = useNavigate();
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Add logic to send registration data to the backend
  //   console.log('Registration Data:', formData);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Registration successful
        console.log('Registration worked');
        navigate('/')
      } else {
        // Registration failed
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <div className={RegistrationStyles['user-registration-container']}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UserRegistration;
