
const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema(
  {
    tender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tender',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    proposedBudget: {
      type: Number,
      required: true,
    },
    proposal: {
      type: String,
      required: true,
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'awarded'],
      default: 'pending',
    },
    evaluationScores: [
      {
        criteriaId: String,
        criteriaName: String,
        score: Number,
        evaluator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comments: String,
      },
    ],
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
