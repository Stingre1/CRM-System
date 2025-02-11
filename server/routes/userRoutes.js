import express from 'express';
import {getAllUsers, getUserById, editUser, deleteUser, createUser, getMe, getSalesReps } from '../controllers/userController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();
// api/users

// Gets all users - Admin only
router.get(
  '/',
  authenticateJWT,
  authorizeRoles('Admin'),
  getAllUsers
);

router.get(
  '/me',
  authenticateJWT,
  authorizeRoles('Admin', 'Sales Manager', 'SalesReps'),
  getMe
);

router.get(
  '/salesReps',
  authenticateJWT,
  authorizeRoles('Admin', 'Sales Manager', 'SalesReps'),
  getSalesReps
);

// Gets user by id - Admin and Sales Manager only.
// TODO: Sales Managers shouldn't be able to look at Admins  
router.get(
  '/:id',
  authenticateJWT,
  authorizeRoles('Admin', 'Sales Managerr'), //TODO: make it so Sales Managers can't access Admin Users
  getUserById
);

// Create a new user - from Admin side
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('Admin'),
  createUser
)

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
