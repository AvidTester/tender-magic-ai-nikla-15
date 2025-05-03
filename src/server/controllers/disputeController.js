
import Dispute from '../models/disputeModel.js';
import Tender from '../models/tenderModel.js';

// @desc    Get all disputes
// @route   GET /api/disputes
// @access  Private
const getDisputes = async (req, res) => {
  try {
    let disputes;
    
    // Admin sees all disputes
    if (req.user.role === 'admin') {
      disputes = await Dispute.find({})
        .populate('vendorId', 'name')
        .populate('tenderId', 'title');
    } else if (req.user.role === 'vendor') {
      // Vendors see only their own disputes
      disputes = await Dispute.find({ vendorId: req.user._id })
        .populate('tenderId', 'title');
    } else {
      return res.status(403).json({ message: 'Not authorized to access disputes' });
    }
    
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dispute by ID
// @route   GET /api/disputes/:id
// @access  Private
const getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('vendorId', 'name email')
      .populate('tenderId', 'title');
    
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    
    // Check if user has permission to view
    if (
      req.user.role === 'admin' || 
      dispute.vendorId._id.toString() === req.user._id.toString()
    ) {
      return res.json(dispute);
    }
    
    res.status(403).json({ message: 'Not authorized to view this dispute' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new dispute
// @route   POST /api/disputes
// @access  Private/Vendor
const createDispute = async (req, res) => {
  try {
    const { tenderId, reason, disputeType } = req.body;
    
    // Only vendors can create disputes
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create disputes' });
    }
    
    // Check if tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    // Check if vendor has already created a dispute for this tender
    const existingDispute = await Dispute.findOne({
      tenderId,
      vendorId: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    });
    
    if (existingDispute) {
      return res.status(400).json({ 
        message: 'You already have an active dispute for this tender' 
      });
    }
    
    const dispute = new Dispute({
      tenderId,
      vendorId: req.user._id,
      reason,
      disputeType,
      status: 'pending',
      createdAt: Date.now()
    });
    
    const createdDispute = await dispute.save();
    res.status(201).json(createdDispute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a dispute (respond to it)
// @route   PUT /api/disputes/:id
// @access  Private/Admin
const updateDispute = async (req, res) => {
  try {
    const { status, responseText } = req.body;
    
    // Only admin can update disputes
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update disputes' });
    }
    
    const dispute = await Dispute.findById(req.params.id);
    
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    
    if (dispute.status !== 'pending') {
      return res.status(400).json({ message: 'This dispute has already been resolved' });
    }
    
    dispute.status = status;
    dispute.responseText = responseText;
    dispute.resolvedAt = Date.now();
    
    const updatedDispute = await dispute.save();
    res.json(updatedDispute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get disputes by tender ID
// @route   GET /api/disputes/tender/:tenderId
// @access  Private
const getDisputesByTender = async (req, res) => {
  try {
    // Admin can see all disputes for a tender
    if (req.user.role === 'admin') {
      const disputes = await Dispute.find({ tenderId: req.params.tenderId })
        .populate('vendorId', 'name');
      return res.json(disputes);
    }
    
    // Vendors can only see their own disputes for a tender
    if (req.user.role === 'vendor') {
      const disputes = await Dispute.find({ 
        tenderId: req.params.tenderId,
        vendorId: req.user._id
      });
      return res.json(disputes);
    }
    
    res.status(403).json({ message: 'Not authorized to access these disputes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get disputes by vendor ID
// @route   GET /api/disputes/vendor/:vendorId
// @access  Private
const getDisputesByVendor = async (req, res) => {
  try {
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user._id.toString() !== req.params.vendorId
    ) {
      return res.status(403).json({ message: 'Not authorized to access these disputes' });
    }
    
    const disputes = await Dispute.find({ vendorId: req.params.vendorId })
      .populate('tenderId', 'title');
    
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getDisputes,
  getDisputeById,
  createDispute,
  updateDispute,
  getDisputesByTender,
  getDisputesByVendor,
};
