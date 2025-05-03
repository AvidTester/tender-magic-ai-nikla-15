
import express from 'express';
import {
  getEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByTender,
  getEvaluationsByEvaluator,
  getEvaluationsBySubmission
} from '../controllers/evaluationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getEvaluations)
  .post(protect, createEvaluation);

router.route('/:id')
  .get(protect, getEvaluationById)
  .put(protect, updateEvaluation)
  .delete(protect, deleteEvaluation);

router.route('/tender/:tenderId')
  .get(protect, getEvaluationsByTender);

router.route('/evaluator/:evaluatorId')
  .get(protect, getEvaluationsByEvaluator);

router.route('/submission/:submissionId')
  .get(protect, getEvaluationsBySubmission);

export default router;
