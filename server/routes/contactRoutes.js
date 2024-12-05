import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

// Get all users 
// Admin only
router.get('/',
    authenticateJWT,
    authorizeRoles('Admin'),
    getAllUsers);

// Get user by ID
// Admin can view all users
// Sales Managers and Reps can view themselves
router.get('/:userId', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
    getUserById);

// Create user
//Admin only
router.post('/', 
    authenticateJWT, 
    authorizeRoles('Admin'), 
    createUser);

// Update user
// Admin can update all
// Sales Manager and Sales Rep can update their own profile
router.put('/:userId', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
    updateUser);

// Delete user
// Admin can delete any user
router.delete('/:userId', 
    authenticateJWT, 
    authorizeRoles('Admin'), 
    deleteUser);

export default router;
