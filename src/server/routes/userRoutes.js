
import express from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  getUsers,
  getEvaluators,
  getVendors
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers);
router.get('/evaluators', protect, admin, getEvaluators);
router.get('/vendors', protect, admin, getVendors);

export default router;
