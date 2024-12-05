import express from 'express';
import { getReports } from '../controllers/reportController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

// Route to get system-wide or role-based reports
router.get(
  '/',
  authenticateJWT,
  authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'),
  getReports // Controller function
);

export default router;
