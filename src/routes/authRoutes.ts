import express from 'express';
import { login, logout, me, register } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken,me);
router.post('/logout', verifyToken, logout);
export default router;