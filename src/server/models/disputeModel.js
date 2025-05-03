
const mongoose = require('mongoose');

const disputeSchema = mongoose.Schema(
  {
    tender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tender',
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    againstWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['rejection', 'winner'],
    },
    reason: {
      type: String,
      required: true,
    },
    evidence: [
      {
        name: String,
        url: String,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolution: {
      type: String,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Dispute = mongoose.model('Dispute', disputeSchema);

module.exports = Dispute;
