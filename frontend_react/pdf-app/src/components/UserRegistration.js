
import React, { useState } from 'react';
import RegistrationStyles from  './UserRegistration.module.css';
import { useNavigate} from 'react-router-dom';

// UserRegistration component
const UserRegistration = () => {
  // Hook to navigate to different pages
  const navigate = useNavigate();
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
      // Send a POST request to the server for user registration
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  // Check if the registration was successful
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
 // Render the user registration form
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
