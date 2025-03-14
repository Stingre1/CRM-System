import express from 'express';
import { registerUser, login } from '../controllers/authController.js';

const router = express.Router();


// Public routes /api/auth/
router.post('/register', registerUser);
router.post('/login', login);

export default router;