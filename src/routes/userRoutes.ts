import express from 'express';
import { verifyRole, verifyToken } from '../middlewares/auth.middleware.js';
import { createUser, getUser, getUsers } from '../controllers/userController.js';
import { get } from 'http';

const router = express.Router();

router.post('/', verifyToken ,verifyRole('ADMIN'), createUser);
router.get('/', verifyToken,verifyRole('ADMIN'),getUsers);
router.get('/:id', verifyToken ,verifyRole('ADMIN'), getUser);
router.put('/', verifyToken,(req, res) => {});
router.delete('/',verifyToken, (req, res) => {});

export default router;