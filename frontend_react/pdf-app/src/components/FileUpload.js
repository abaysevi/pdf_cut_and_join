
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUp from './FileUpload.module.css'; 

// FileUpload component
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Handler for file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Check if the selected file is a PDF
    if (selectedFile && selectedFile.type === 'application/pdf') {
      console.log("pdf validated")
      setFile(selectedFile);
    } else {
      setFile(null);
      console.error('Please select a valid PDF file.');
    }
  };
// Handler for file upload
  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('No file selected.');
        return;
      }

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
  
// Render the file upload form
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
