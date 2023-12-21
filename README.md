# PDF Page Selector and Merger

This project allows users to upload a PDF file, select specific pages from it, and then combine and download the selected pages as a new PDF file.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Getting Started](#getting-started)
- [License](#license)

## Features

- User authentication and registration system
- PDF file upload
- Selection of specific pages from the uploaded PDF
- Combination of selected pages into a new PDF
- Download of the newly generated PDF

## Tech Stack

- **Frontend:**
  - React
  - file-saver

- **Backend:**
  - Node.js
  - Express
  - body-parser
  - sqlite3 (for user data storage)
  - cors
  - bcrypt
  - pdf-lib
  - fs
  - pdf2pic
  - path
  - multer

## Installation

Before running the application, make sure to install the dependencies for both the frontend and backend.

### Backend Installation

Navigate to the backend project folder and run `npm install`.

```bash
cd backend
npm install
```

### Frontend Installation

Navigate to the frontend project folder and run `npm install`.

```bash
cd frontend_react/pdf-app
npm install
```

## Usage

1. Start the backend server by running `node server.js` in the backend folder.

```bash
node server.js
```

2. Start the React frontend by running `npm start` in the frontend folder.

```bash
npm start
```

3. Open your browser and go to `http://localhost:3000` to use the application.

## Getting Started

To use the application, follow these steps:

1. Register or log in using the provided user module.
2. Upload a PDF file.
3. Select specific pages from the uploaded PDF.
4. Combine the selected pages into a new PDF.
5. Download the newly generated PDF.

## License

This project is licensed under the [MIT License](LICENSE).
