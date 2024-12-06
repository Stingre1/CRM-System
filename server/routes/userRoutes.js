import express from 'express';
import {getAllUsers, getUserById, editUser, deleteUser } from '../controllers/userController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get(
  '/getAllUsers',
  authenticateJWT,
  authorizeRoles('Admin'),
  getAllUsers
);

router.get(
  '/getUserById/:id',
  authenticateJWT,
  authorizeRoles('Admin', 'Sales Managerr'), //TODO: make it so Sales Managers can't access Admin Users
  getAllUsers
);

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
