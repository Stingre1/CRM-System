import express from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contactController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();
//api/contacts/
// Get all contacts - Admin and Sales Manager can access
router.get('/',
  authenticateJWT,
  authorizeRoles('Admin', 'Sales Manager'),
  getAllContacts);

// Get contact by ID - Admin, Sales Manager, and the Sales Rep who owns the contact can access
router.get('/:contactId', 
  authenticateJWT,
   authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
   getContactById);

// Create contact - Admin and Sales Manager can access
router.post('/', 
  authenticateJWT, 
  authorizeRoles('Admin', 'Sales Manager'), 
  createContact);

// Update contact - Admin and Sales Manager can access, Sales Rep can update their own contacts
router.put('/:contactId', 
  authenticateJWT, 
  authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
  updateContact);

// Delete contact - Admin and Sales Manager can access, Sales Rep can delete their own contacts
router.delete('/:contactId', 
  authenticateJWT, 
  authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
  deleteContact);

export default router;
