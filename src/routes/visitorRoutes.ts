
import express from 'express';
import { verifyRole, verifyToken } from '../middlewares/auth.middleware.js';
import { createVisitor } from '../controllers/visitorController.js';

const router=express.Router();

router.post('/',verifyToken,verifyRole('PASANTE'), createVisitor);
router.get('/', (req, res) => {});
router.get('/:id', (req, res) => {});
router.put('/:id', (req, res) => {});
router.delete('/:id', (req, res) => {});

export default router;