
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'file-saver';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import FilePro from './FileProcessing.module.css';

// FileProcessing component
const FileProcessing = () => {
  // Extract file path from the URL query parameter
  const location = useLocation();
  const filePath = new URLSearchParams(location.search).get('filePath');

  // State to store PDF pages, selected pages, and total number of pages
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [numPages, setNumPages] = useState(null);


  // Fetch PDF pages when the component mounts or when the file path changes
  useEffect(() => {
    const fetchPdfPages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/get-pdf-pages?filePath=${encodeURIComponent(filePath)}`);
        if (response.ok) {
          const { pages } = await response.json();
          console.log('Fetched pages:', pages);
          setPdfPages(pages);
          setNumPages(pages.length);
        } else {
          console.error('Error fetching PDF pages');
        }
      } catch (error) {
        console.error('Error during PDF page fetching:', error);
      }
    };

    if (filePath) {
      fetchPdfPages();
    }
  }, [filePath]);

  const handlePageSelection = (pageNumber) => {
    const isSelected = selectedPages.includes(pageNumber);

    if (isSelected) {
      // Deselect the page
      setSelectedPages((prevSelectedPages) =>
        prevSelectedPages.filter((page) => page !== pageNumber)
      );
    } else {
      // Select the page
      setSelectedPages((prevSelectedPages) => [...prevSelectedPages, pageNumber]);
    }
  };

  const handleCombineAndDownload = async () => {
    try {
      // Send a request to the server to combine selected pages and create a new PDF
      const response = await fetch('http://localhost:3001/combine-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          selectedPages,
        }),
      });

      if (response.ok) {
        // Extract the combined PDF ArrayBuffer from the response
        const combinedPdfArrayBuffer = await response.arrayBuffer();

        // Create a Blob from the ArrayBuffer
        const blob = new Blob([combinedPdfArrayBuffer], { type: 'application/pdf' });

        // Display a success message or perform additional actions if needed
        console.log('Combined PDF created successfully');

        // Use FileSaver.js to save the Blob as a file
        saveAs(blob, 'combined.pdf');
      } else {
        console.error('Error combining pages');
      }
    } catch (error) {
      console.error('Error during page combination:', error);
    }
  };
   // Render the FileProcessing component
  return (
    <div className={FilePro['file-processing-container']}>
      <h2>File Processing Page</h2>
  
      <div className={FilePro['page-selection']}>
        <h3>Select Pages to Combine</h3>
        <div>
          {pdfPages.map((pageNumber) => (
            <div
              key={pageNumber}
              className={`${FilePro['page-box']} ${selectedPages.includes(pageNumber) ? FilePro['selected'] : ''}`}
              onClick={() => handlePageSelection(pageNumber)}
            >
              {filePath && (
                <img
                  src={`http://localhost:3001/get-pdf-page?filePath=${encodeURIComponent(
                    filePath
                  )}&pageNumber=${pageNumber}`}
                  alt={`Page ${pageNumber}`}
                  className={FilePro['page-box-img']}
                />
              )}
              <div className={FilePro['page-number']}>Page {pageNumber}</div>
            </div>
          ))}
        </div>
      </div>
  
      <div className={FilePro['selected-pages']}>
        <h3>Selected Pages</h3>
        <div>{selectedPages.map((page) => <div key={page}>Page {page}</div>)}</div>
      </div>
  
      <button className={FilePro['button']} onClick={handleCombineAndDownload}>
        Combine and Download Selected Pages
      </button>
    </div>
  );
  
};


export default FileProcessing;
