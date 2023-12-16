
// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import FileUpload from './components/FileUpload';
import FileProcessing from './components/FileProcessing';

// const PrivateRoute = ({ element, authenticated, ...rest }) => {
//   return authenticated ? element : <Navigate to="/" />;
// };

const PrivateRoute = ({ element, authenticated, ...rest }) => {
  if (authenticated) {
    return element;
  } else {
    console.log("it faild");
    return <Navigate to="/" />;
  }
};

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);


  const handleFileUpload = (file) => {
    // This is a placeholder for handling the file upload in the parent component
    console.log('File uploaded in the parent component:', file);
  };

  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<UserRegistration />} />
        <Route path="/" element={<UserLogin setAuthenticated={setAuthenticated} />} />
        <Route path="/upload" element={<PrivateRoute element={<FileUpload FileUpload onUpload={handleFileUpload}/>} authenticated={authenticated} />} />
        <Route
          path="/file-processing"
          element={<PrivateRoute element={<FileProcessing />} authenticated={authenticated} />}
        />
      </Routes>
    </Router>
  );
};

export default App;