
import express from 'express';
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionsByTender,
  getSubmissionsByVendor
} from '../controllers/submissionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getSubmissions)
  .post(protect, createSubmission);

router.route('/:id')
  .get(protect, getSubmissionById)
  .put(protect, updateSubmission)
  .delete(protect, deleteSubmission);

router.route('/tender/:tenderId')
  .get(protect, getSubmissionsByTender);

router.route('/vendor/:vendorId')
  .get(protect, getSubmissionsByVendor);

export default router;
