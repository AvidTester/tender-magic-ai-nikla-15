
import Evaluation from '../models/evaluationModel.js';
import Submission from '../models/submissionModel.js';

// @desc    Fetch all evaluations
// @route   GET /api/evaluations
// @access  Private/Admin
const getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({})
      .populate('evaluatorId', 'name')
      .populate('submissionId', 'status')
      .populate({
        path: 'submissionId',
        populate: {
          path: 'tenderId',
          select: 'title'
        }
      });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single evaluation
// @route   GET /api/evaluations/:id
// @access  Private
const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('evaluatorId', 'name')
      .populate('submissionId');
    
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Allow admin, the evaluator who created it, or tender owner to view
    if (
      req.user.role === 'admin' || 
      evaluation.evaluatorId._id.toString() === req.user._id.toString()
    ) {
      return res.json(evaluation);
    }
    
    res.status(403).json({ message: 'Not authorized to access this evaluation' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an evaluation
// @route   POST /api/evaluations
// @access  Private/Evaluator
const createEvaluation = async (req, res) => {
  try {
    const { 
      submissionId, 
      scores,
      comments,
      overallScore 
    } = req.body;

    // Only evaluators can create evaluations
    if (req.user.role !== 'evaluator' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only evaluators can create evaluations' });
    }

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if evaluator already evaluated this submission
    const existingEvaluation = await Evaluation.findOne({
      submissionId,
      evaluatorId: req.user._id
    });

    if (existingEvaluation) {
      return res.status(400).json({ message: 'You have already evaluated this submission' });
    }

    const evaluation = new Evaluation({
      submissionId,
      evaluatorId: req.user._id,
      scores,
      comments,
      overallScore,
      evaluationDate: Date.now()
    });

    const createdEvaluation = await evaluation.save();

    // Update submission status
    submission.status = 'Evaluated';
    await submission.save();

    res.status(201).json(createdEvaluation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an evaluation
// @route   PUT /api/evaluations/:id
// @access  Private
const updateEvaluation = async (req, res) => {
  try {
    const { scores, comments, overallScore } = req.body;

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Only the evaluator who created it or admin can update
    if (
      evaluation.evaluatorId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this evaluation' });
    }

    evaluation.scores = scores || evaluation.scores;
    evaluation.comments = comments || evaluation.comments;
    evaluation.overallScore = overallScore || evaluation.overallScore;
    evaluation.lastUpdated = Date.now();

    const updatedEvaluation = await evaluation.save();
    res.json(updatedEvaluation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an evaluation
// @route   DELETE /api/evaluations/:id
// @access  Private
const deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Only evaluator who created it or admin can delete
    if (
      evaluation.evaluatorId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this evaluation' });
    }

    await evaluation.deleteOne();
    
    // Update submission status if this was the only evaluation
    const submissionId = evaluation.submissionId;
    const remainingEvaluations = await Evaluation.countDocuments({ submissionId });
    
    if (remainingEvaluations === 0) {
      const submission = await Submission.findById(submissionId);
      if (submission) {
        submission.status = 'Submitted';
        await submission.save();
      }
    }
    
    res.json({ message: 'Evaluation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch evaluations by tender
// @route   GET /api/evaluations/tender/:tenderId
// @access  Private
const getEvaluationsByTender = async (req, res) => {
  try {
    // First get all submissions for this tender
    const submissions = await Submission.find({ tenderId: req.params.tenderId });
    const submissionIds = submissions.map(sub => sub._id);
    
    // Then get all evaluations for these submissions
    const evaluations = await Evaluation.find({ submissionId: { $in: submissionIds } })
      .populate('evaluatorId', 'name')
      .populate('submissionId')
      .populate({
        path: 'submissionId',
        populate: {
          path: 'vendorId',
          select: 'name'
        }
      });
    
    if (req.user.role === 'admin' || req.user.role === 'evaluator') {
      return res.json(evaluations);
    }
    
    res.status(403).json({ message: 'Not authorized to access these evaluations' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch evaluations by evaluator
// @route   GET /api/evaluations/evaluator/:evaluatorId
// @access  Private
const getEvaluationsByEvaluator = async (req, res) => {
  try {
    // Check authorization - only admin or the evaluator themselves
    if (
      req.user.role !== 'admin' && 
      req.user._id.toString() !== req.params.evaluatorId
    ) {
      return res.status(403).json({ message: 'Not authorized to access these evaluations' });
    }

    const evaluations = await Evaluation.find({ evaluatorId: req.params.evaluatorId })
      .populate('submissionId')
      .populate({
        path: 'submissionId',
        populate: {
          path: 'tenderId',
          select: 'title'
        }
      });
    
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch evaluations by submission
// @route   GET /api/evaluations/submission/:submissionId
// @access  Private
const getEvaluationsBySubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Admin and evaluators can see all evaluations
    if (req.user.role === 'admin' || req.user.role === 'evaluator') {
      const evaluations = await Evaluation.find({ submissionId: req.params.submissionId })
        .populate('evaluatorId', 'name');
      return res.json(evaluations);
    }
    
    // Vendors can only see evaluations of their own submissions
    if (
      req.user.role === 'vendor' && 
      submission.vendorId.toString() === req.user._id.toString()
    ) {
      const evaluations = await Evaluation.find({ submissionId: req.params.submissionId })
        .populate('evaluatorId', 'name');
      return res.json(evaluations);
    }
    
    res.status(403).json({ message: 'Not authorized to access these evaluations' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByTender,
  getEvaluationsByEvaluator,
  getEvaluationsBySubmission,
};
