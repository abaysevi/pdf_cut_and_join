

// src/components/FileProcessing.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { saveAs } from 'file-saver';

const FileProcessing = () => {
    const location = useLocation();
    const filePath = new URLSearchParams(location.search).get('filePath');

    const [pdfPages, setPdfPages] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    // const [outputPdfBlob, setOutputPdfBlob] = useState(null);

    useEffect(() => {
        const fetchPdfPages = async () => {
            try {
                const response = await fetch(`http://localhost:3001/get-pdf-pages?filePath=${encodeURIComponent(filePath)}`);
                if (response.ok) {
                    const { pages } = await response.json();
                    console.log('Fetched pages:', pages);
                    setPdfPages(pages);
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


    return (
        <div>
            <h2>File Processing Page</h2>

            <div>
                <h3>Select Pages to Combine</h3>
                <div>
                    {pdfPages.map((pageNumber) => (
                        <button
                            key={pageNumber}
                            style={{ margin: '5px', backgroundColor: selectedPages.includes(pageNumber) ? 'lightblue' : 'white' }}
                            onClick={() => handlePageSelection(pageNumber)}
                        >
                            Page {pageNumber}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={handleCombineAndDownload}>Combine and Download Selected Pages</button>


        </div>
    );
};

export default FileProcessing;

// {outputPdfBlob && (
//     <div>
//         <h3>Combined PDF:</h3>
//         {/* Display the combined PDF, for example, using an embed or download link */}
//         <a href={URL.createObjectURL(outputPdfBlob)} download="combined.pdf">
//             Download Combined PDF
//         </a>
//     </div>
// )}