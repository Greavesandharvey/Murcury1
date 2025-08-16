const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: 'mercuryone',
  host: 'localhost',
  database: 'mercuryone',
  password: 'mercuryone',
  port: 5432,
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.originalname.endsWith('.csv') || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Database query function
const db = {
  query: (text, params) => pool.query(text, params),
};

// Routes
require('./routes/customers')(app, db);

// Price Lists routes with multer middleware
const priceListsRoutes = require('./routes/price-lists');
// Add multer middleware to the app context
app.use((req, res, next) => {
  req.upload = upload;
  next();
});
// Add middleware for file upload on specific route
app.post('/api/price-list-imports', upload.single('file'), (req, res, next) => {
  next();
});
priceListsRoutes(app, db);

// Serve test API HTML file
app.get('/test-api', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-api.html'));
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  pool.end();
  process.exit(0);
});
