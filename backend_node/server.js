const express = require('express');
const multer = require('multer');
const path = require('path');
const { fromPath } = require('pdf2pic');
const fs = require('fs').promises;
const { PDFDocument } = require('pdf-lib');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const port = 3001;

const pdf = require('pdf-parse');

app.use(cors());
app.use(express.json());

// Create a folder to store converted PDFs
const convertedPdfFolder = path.join(__dirname, 'converted_pdfs');

// Create the folder if it does not exist
fs.mkdir(convertedPdfFolder, { recursive: true })
  .then(() => console.log('Converted PDF folder created'))
  .catch((err) => console.error('Error creating converted PDF folder:', err));

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create a SQLite database for user management
const db = new sqlite3.Database('users.db');

// Initialize the 'users' table in the database if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)');
});

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize multer with the specified storage configuration
const upload = multer({ storage: storage });


// User registration endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the 'users' table with the hashed password
  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'User registered successfully' });
  });
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Retrieve the user from the 'users' table
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the hashed password with the provided password
    const passwordMatch = await bcrypt.compare(password, row.password);

    if (passwordMatch) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// File upload endpoint
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  const filePath = path.join('uploads', req.file.filename);
  res.json({ filePath });
});

// Process uploaded PDF endpoint
app.post('/process', async (req, res) => {
  try {
    const filePath = req.body.filePath;
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    // Process the PDF data (add your logic here)

    res.json({ message: 'File processed successfully' });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get the number of pages in a PDF endpoint
app.get('/get-pdf-pages', async (req, res) => {
  try {
    const { filePath } = req.query;
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    const numPages = data.numpages;

    const pages = Array.from({ length: numPages }, (_, i) => i + 1);
    res.json({ pages });
  } catch (error) {
    console.error('Error fetching PDF pages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get a specific page from a PDF as an image endpoint
app.get('/get-pdf-page', async (req, res) => {
  try {
    const { filePath, pageNumber } = req.query;

    // Validate the requested page number
    const requestedPage = parseInt(pageNumber, 10);
    if (isNaN(requestedPage) || requestedPage < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    // Create an instance of pdf2pic
    const options = {
      density: 300,
      saveFilename: `page-${requestedPage}`,
      savePath: convertedPdfFolder, // Provide the correct folder for saving images
      format: 'png',
      width: 600,
      height: 600,
    };
    const convert = fromPath(filePath, options);

    // Convert the requested page to an image
    const { path: imagePath } = await convert(requestedPage, { responseType: 'image' });
    console.log('Image path:', imagePath);
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename=${requestedPage}.png`);

    // Send the image file
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching PDF page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Combine selected pages of a PDF into a new PDF endpoint
app.post('/combine-pages', async (req, res) => {
  try {
    const { filePath, selectedPages } = req.body;

    console.log(filePath, selectedPages);

    // Read the original PDF file
    const originalPdfBuffer = await fs.readFile(filePath);
    const originalPdfDoc = await PDFDocument.load(originalPdfBuffer);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Copy selected pages from the original PDF to the new PDF
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    // Save the combined PDF as a new file
    const combinedPdfFileName = `combined_${Date.now()}.pdf`;
    const combinedPdfPath = path.join(convertedPdfFolder, combinedPdfFileName);
    const combinedPdfBytes = await newPdfDoc.save();
    await fs.writeFile(combinedPdfPath, combinedPdfBytes);

    // Send the combined PDF file
    res.sendFile(combinedPdfPath);
  } catch (error) {
    console.error('Error combining pages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
