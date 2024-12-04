import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import logger from './middleware/logger.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import authenticateJWT from './middleware/authMiddleware.js';
import authorizeRoles from './middleware/authorizeRoles.js';

// Current path stuff
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const port = process.env.PORT || 5000; // Set default port in case it's not in .env

const app = express();

// Connect to DB
connectDB();

// Setup static folder for frontend assets (assuming client folder is in the root of your project)
app.use(express.static(path.join(__dirname, '../client')));

// Middleware setup
app.use(logger); // Log all incoming requests (global middleware)

app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded( {extended: false}));

// Routes
app.use('/api/auth', authRoutes);

// Protected Route (auth required)
app.use('/api', authenticateJWT, authorizeRoles, leadRoutes);


app.use(authenticateJWT);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`['green']);
});
