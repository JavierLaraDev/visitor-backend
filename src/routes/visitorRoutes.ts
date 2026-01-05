
import express from 'express';
import { verifyRole, verifyToken } from '../middlewares/auth.middleware.js';
import { createVisitor, deleteVisitor, getVisitor, getVisitors, updateVisitor, updateVisitorStatus } from '../controllers/visitorController.js';

const router=express.Router();

router.post('/',verifyToken,verifyRole('PASANTE'), createVisitor);
router.get('/',verifyToken,verifyRole('PASANTE','ADMIN'), getVisitors);
router.get('/:id',verifyToken,verifyRole('PASANTE'), getVisitor);
router.put('/:id',verifyToken,verifyRole('PASANTE'),updateVisitor );
router.delete('/:id',verifyToken,verifyRole('PASANTE'), deleteVisitor);
router.patch('/:id/status', verifyToken, verifyRole('ADMIN'), updateVisitorStatus);

export default router;