// // src/components/FileUpload.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import "./FileUpload.css";

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleUpload = async () => {
//     try {
//       // Create a FormData object to send the file to the server
//       const formData = new FormData();
//       formData.append('pdfFile', file);

//       // Send the file to the /upload endpoint on the server
//       const response = await fetch('http://localhost:3001/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         // Extract the file path from the response
//         const { filePath } = await response.json();

//         // Navigate to the processing page and pass the file path as a query parameter
//         navigate(`/file-processing?filePath=${encodeURIComponent(filePath)}`);
//       } else {
//         console.error('File upload failed');
//       }
//     } catch (error) {
//       console.error('Error during file upload:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>File Upload</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default FileUpload;


// src/components/FileUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUp from './FileUpload.module.css'; // Make sure to adjust the path accordingly

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('pdfFile', file);

      // Send the file to the /upload endpoint on the server
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Extract the file path from the response
        const { filePath } = await response.json();

        // Navigate to the processing page and pass the file path as a query parameter
        navigate(`/file-processing?filePath=${encodeURIComponent(filePath)}`);
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  return (
    <div className={FileUp['file-upload-container']}>
      <h2>File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button className={FileUp['upload-button']} onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
