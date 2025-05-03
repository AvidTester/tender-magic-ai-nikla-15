
import express from 'express';
import { 
  getTenders, 
  getTenderById, 
  createTender, 
  updateTender, 
  deleteTender 
} from '../controllers/tenderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTenders)
  .post(protect, admin, createTender);

router.route('/:id')
  .get(getTenderById)
  .put(protect, admin, updateTender)
  .delete(protect, admin, deleteTender);

export default router;
