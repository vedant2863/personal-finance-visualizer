import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      ref: 'Category',
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
    },
    month: {
      type: Number, // 0-11 representing Jan-Dec
      required: [true, 'Month is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one budget per category per month/year
BudgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);

export default Budget;