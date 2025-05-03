
import mongoose from 'mongoose';

const evaluationSchema = mongoose.Schema(
  {
    tender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tender',
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Submission',
    },
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    scores: [
      {
        criteriaId: String,
        criteriaName: String,
        score: Number,
        weight: Number,
        comments: String,
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
