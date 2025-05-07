import mongoose from 'mongoose';

// Define the schema only if it doesn't exist yet
const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before creating a new one
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;