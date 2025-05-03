
import express from 'express';
import {
  getDisputes,
  getDisputeById,
  createDispute,
  updateDispute,
  getDisputesByTender,
  getDisputesByVendor
} from '../controllers/disputeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDisputes)
  .post(protect, createDispute);

router.route('/:id')
  .get(protect, getDisputeById)
  .put(protect, admin, updateDispute);

router.route('/tender/:tenderId')
  .get(protect, getDisputesByTender);

router.route('/vendor/:vendorId')
  .get(protect, getDisputesByVendor);

export default router;
