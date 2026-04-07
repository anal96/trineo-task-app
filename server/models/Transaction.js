import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Salary', 
      'Freelance', 
      'Sale', 
      'Consulting', 
      'Rent', 
      'Utilities', 
      'Office Supplies', 
      'Marketing', 
      'Travel', 
      'Other'
    ]
  },
  date: {
    type: Date,
    default: Date.now
  },
  billUrl: {
    type: String, // Path to the uploaded bill/receipt
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Transaction', transactionSchema);
