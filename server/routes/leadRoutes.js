import express from 'express';
import { getAllLeads, getLeadById, createLead, updateLead, deleteLead, assignLead, searchLeads } from '../controllers/leadController.js';
import authenticateJWT from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

// Get all leads Admin and Sales Manager can access
router.get('/', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager'), 
    getAllLeads);

// Get lead by ID - Admin, Sales Manager, and the Sales Rep who owns the lead can access
router.get('/:leadId', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
    getLeadById);

// Create lead - Admin and Sales Manager can access
router.post('/', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager'), 
    createLead);

// Update lead - Admin and Sales Manager can access, Sales Rep can update their own leads
router.put('/:leadId', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
    updateLead);

// Delete lead - Admin and Sales Manager can access, Sales Rep can delete their own leads
router.delete('/:leadId', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'), 
    deleteLead);

// Assign lead to Sales Rep - Admin and Sales Manager can assign leads
router.put('/assign/:leadId', 
    authenticateJWT, 
    authorizeRoles('Admin', 'Sales Manager'), 
    assignLead);

router.get('/search?query=value',
    authenticateJWT,
    authorizeRoles('Admin', 'Sales Manager', 'Sales Rep'),
    searchLeads);


export default router;
