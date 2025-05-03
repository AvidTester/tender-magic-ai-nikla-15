
const mongoose = require('mongoose');

const tenderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'open', 'closed', 'awarded', 'cancelled'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
    evaluationCriteria: [
      {
        name: String,
        weight: Number,
      },
    ],
    assignedEvaluators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
    },
    disputeTimeFrame: {
      type: Number,
      default: 7, // 7 days
    },
  },
  {
    timestamps: true,
  }
);

const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;
