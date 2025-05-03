
import Submission from '../models/submissionModel.js';

// @desc    Fetch all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({}).populate('tenderId', 'title');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single submission
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('tenderId', 'title deadline')
      .populate('vendorId', 'name email');
    
    // Check if user has permission to view submission
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Allow admin, submission owner (vendor), or tender owner to view
    if (
      req.user.role === 'admin' || 
      submission.vendorId._id.toString() === req.user._id.toString()
    ) {
      return res.json(submission);
    }
    
    res.status(403).json({ message: 'Not authorized to access this submission' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = async (req, res) => {
  try {
    const { tenderId, documents, technicalDetails, financialDetails } = req.body;

    // Only vendors can create submissions
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create submissions' });
    }

    const submission = new Submission({
      tenderId,
      vendorId: req.user._id,
      documents,
      technicalDetails,
      financialDetails,
      submissionDate: Date.now(),
      status: 'Submitted'
    });

    const createdSubmission = await submission.save();
    res.status(201).json(createdSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a submission
// @route   PUT /api/submissions/:id
// @access  Private
const updateSubmission = async (req, res) => {
  try {
    const { documents, technicalDetails, financialDetails } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only the vendor who created the submission can update it
    if (submission.vendorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this submission' });
    }

    // Only allow updates if status is still 'Submitted'
    if (submission.status !== 'Submitted' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cannot update submission after review has begun' });
    }

    submission.documents = documents || submission.documents;
    submission.technicalDetails = technicalDetails || submission.technicalDetails;
    submission.financialDetails = financialDetails || submission.financialDetails;
    submission.lastUpdated = Date.now();

    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a submission
// @route   DELETE /api/submissions/:id
// @access  Private
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only vendor who created it or admin can delete
    if (submission.vendorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this submission' });
    }

    // Only allow deletion if status is still 'Submitted'
    if (submission.status !== 'Submitted' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cannot delete submission after review has begun' });
    }

    await submission.deleteOne();
    res.json({ message: 'Submission removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch submissions by tender
// @route   GET /api/submissions/tender/:tenderId
// @access  Private
const getSubmissionsByTender = async (req, res) => {
  try {
    const submissions = await Submission.find({ tenderId: req.params.tenderId })
      .populate('vendorId', 'name email')
      .populate('tenderId', 'title');
    
    // Only admin or evaluator can see all submissions for a tender
    if (req.user.role === 'admin' || req.user.role === 'evaluator') {
      return res.json(submissions);
    }
    
    // Vendors can only see their own submissions
    if (req.user.role === 'vendor') {
      const filteredSubmissions = submissions.filter(
        submission => submission.vendorId._id.toString() === req.user._id.toString()
      );
      return res.json(filteredSubmissions);
    }
    
    res.status(403).json({ message: 'Not authorized to access these submissions' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch submissions by vendor
// @route   GET /api/submissions/vendor/:vendorId
// @access  Private
const getSubmissionsByVendor = async (req, res) => {
  try {
    // Check authorization - only admin or the vendor themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.vendorId) {
      return res.status(403).json({ message: 'Not authorized to access these submissions' });
    }

    const submissions = await Submission.find({ vendorId: req.params.vendorId })
      .populate('tenderId', 'title deadline status');
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionsByTender,
  getSubmissionsByVendor,
};
