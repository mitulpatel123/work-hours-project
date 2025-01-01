import express from 'express';
import { login, changePin, validateToken } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/change-pin', verifyToken, changePin);
router.get('/validate', validateToken);

export default router;