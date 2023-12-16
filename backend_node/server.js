// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const cors = require('cors'); 
const convertedPdfFolder = path.join(__dirname, 'converted_pdfs');

// Ensure that the converted PDF folder exists
fs.mkdir(convertedPdfFolder, { recursive: true })
  .then(() => console.log('Converted PDF folder created'))
  .catch((err) => console.error('Error creating converted PDF folder:', err));

const pdf = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  // Handle the uploaded file (e.g., save the file path or other information)
  const filePath = path.join('uploads', req.file.filename);

  // Respond with the file path or any other relevant information
  res.json({ filePath });
});

// File processing endpoint
app.post('/process', (req, res) => {
  // Retrieve the file path from the request
  const filePath = req.body.filePath;

  // Implement logic to process the uploaded PDF file (e.g., using a PDF library)

  // Respond with a success message or other relevant information
  res.json({ message: 'File processed successfully' });
});

app.get('/get-pdf-pages', async (req, res) => {
    console.log("here i am");
    try {
      const { filePath } = req.query;
      console.log(req.query);
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
  
      // Use getNumberOfPages to get the number of pages
      const numPages = data.numpages;
  
      const pages = Array.from({ length: numPages }, (_, i) => i + 1);
      console.log(pages);
      res.json({ pages });
    } catch (error) {
      console.error('Error fetching PDF pages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/combine-pages', async (req, res) => {
    try {
      const { filePath, selectedPages } = req.body;
  
      console.log(filePath, selectedPages);
  
      // Read the original PDF file
      const originalPdfBuffer = await fs.readFile(filePath);
      const originalPdfDoc = await PDFDocument.load(originalPdfBuffer);
  
      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();
  
      // Add selected pages from the original PDF to the new PDF
      for (const pageNumber of selectedPages) {
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageNumber - 1]);
        newPdfDoc.addPage(copiedPage);
      }
  
      // Save the combined PDF to the converted PDF folder
      const combinedPdfFileName = `combined_${Date.now()}.pdf`;
      const combinedPdfPath = path.join(convertedPdfFolder, combinedPdfFileName);
      const combinedPdfBytes = await newPdfDoc.save();
      await fs.writeFile(combinedPdfPath, combinedPdfBytes);
  
      // Send the saved combined PDF file to the frontend
      res.sendFile(combinedPdfPath);
    } catch (error) {
      console.error('Error combining pages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

