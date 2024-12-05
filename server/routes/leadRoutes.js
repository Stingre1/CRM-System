import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  assignLead,
  searchLeads,
} from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.put('/:leadId/assign', assignLead);
router.get('/search', searchLeads);

export default router;
