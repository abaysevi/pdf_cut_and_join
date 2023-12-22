
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import FileUpload from './components/FileUpload';
import FileProcessing from './components/FileProcessing';


// Define a PrivateRoute component to handle authenticated routes
const PrivateRoute = ({ element, authenticated, ...rest }) => {
  // If the user is authenticated, render the provided element, otherwise, redirect to the home page
  if (authenticated) {
    return element;
  } else {
    console.log("it faild");
    return <Navigate to="/" />;
  }
};
// Main App component
const App = () => {
  // State to track user authentication status
  const [authenticated, setAuthenticated] = useState(false);

   // Callback function to handle file upload in the parent component
  const handleFileUpload = (file) => {
    // This is a placeholder for handling the file upload in the parent component
    console.log('File uploaded in the parent component:', file);
  };

  return (
    <Router>
      <Routes>
        {/* Route for user registration */}
        <Route path="/registration" element={<UserRegistration />} />
        {/* Route for user login */}
        <Route path="/" element={<UserLogin setAuthenticated={setAuthenticated} />} />
        {/* Route for file upload, wrapped in PrivateRoute for authentication */}
        <Route path="/upload" element={<PrivateRoute element={<FileUpload FileUpload onUpload={handleFileUpload}/>} authenticated={authenticated} />} />
        {/* Route for file processing, wrapped in PrivateRoute for authentication */}
        <Route
          path="/file-processing"
          element={<PrivateRoute element={<FileProcessing />} authenticated={authenticated} />}
        />
      </Routes>
    </Router>
  );
};

export default App;