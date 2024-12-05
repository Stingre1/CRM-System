import express from 'express';
import { editUser, deleteUser } from '../controllers/userController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

// Edit an existing user (Admin only)
router.put(
  '/edit/:userId',
  authenticateJWT,
  authorizeRoles('Admin'),
  editUser
);

// Delete a user (Admin only)
router.delete(
  '/delete/:userId',
  authenticateJWT,
  authorizeRoles('Admin'),
  deleteUser
);

export default router;
