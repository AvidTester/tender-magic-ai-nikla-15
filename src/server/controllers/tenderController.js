
import Tender from '../models/tenderModel.js';

// @desc    Fetch all tenders
// @route   GET /api/tenders
// @access  Public
const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({});
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single tender
// @route   GET /api/tenders/:id
// @access  Public
const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    
    if (tender) {
      res.json(tender);
    } else {
      res.status(404).json({ message: 'Tender not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a tender
// @route   POST /api/tenders
// @access  Private/Admin
const createTender = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      status
    } = req.body;

    const tender = new Tender({
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      status,
      createdBy: req.user._id,
    });

    const createdTender = await tender.save();
    res.status(201).json(createdTender);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a tender
// @route   PUT /api/tenders/:id
// @access  Private/Admin
const updateTender = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      status
    } = req.body;

    const tender = await Tender.findById(req.params.id);

    if (tender) {
      tender.title = title || tender.title;
      tender.description = description || tender.description;
      tender.category = category || tender.category;
      tender.budget = budget || tender.budget;
      tender.deadline = deadline || tender.deadline;
      tender.requirements = requirements || tender.requirements;
      tender.status = status || tender.status;

      const updatedTender = await tender.save();
      res.json(updatedTender);
    } else {
      res.status(404).json({ message: 'Tender not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a tender
// @route   DELETE /api/tenders/:id
// @access  Private/Admin
const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (tender) {
      await tender.deleteOne();
      res.json({ message: 'Tender removed' });
    } else {
      res.status(404).json({ message: 'Tender not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
};
