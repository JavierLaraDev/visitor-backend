import express from 'express';
import { verifyRole, verifyToken } from '../middlewares/auth.middleware.js';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', verifyToken ,verifyRole('ADMIN'), createUser);
router.get('/', verifyToken,verifyRole('ADMIN'),getUsers);
router.get('/:id', verifyToken ,verifyRole('ADMIN'), getUser);
router.put('/:id', verifyToken, verifyRole('ADMIN'), updateUser);
router.delete('/:id',verifyToken, verifyRole('ADMIN'), deleteUser);

export default router;