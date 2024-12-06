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
import contactRoutes from './routes/contactRoutes.js'; 
import authenticateJWT from './middleware/authMiddleware.js';
import authorizeRoles from './middleware/authorizeRoles.js';
import userRoutes from './routes/userRoutes.js';

// Current path stuff
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.join(__dirname)});

const port = process.env.PORT || 5000;

const app = express();

// DB Connection
connectDB();

// Setup static folder for frontend assets
app.use(express.static(path.join(__dirname, '../client')));

// Middleware setup
app.use(logger); // Log all incoming requests (global middleware)
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false }));// Parses incoming url encoded requests

// Routes
app.use('/api/auth', authRoutes);

// Protected Routes (auth required)

app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/leads', authenticateJWT, leadRoutes); 
app.use('/api/contacts', authenticateJWT, contactRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`['green']);
});
