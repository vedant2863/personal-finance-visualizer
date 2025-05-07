import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      default: '#3B82F6', // Default blue color
    },
    icon: {
      type: String,
      default: 'tag',
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;