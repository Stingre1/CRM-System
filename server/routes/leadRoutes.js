import express from 'express'
import { } from '../controllers/leadControllers.js'
import authenticateJWT from '../middleware/authMiddleware.js'
import authorizeRoles from '../middleware/authorizeRoles.js'

const router = express.Router();

//get all leads
router.get('/leads', authenticateJWT, authorizeRoles)