import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#1E40AF'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
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

// Calculate progress before saving
projectSchema.pre('save', function(next) {
  if (this.totalTasks > 0) {
    this.progress = Math.round((this.tasksCompleted / this.totalTasks) * 100);
  }
  next();
});

export default mongoose.model('Project', projectSchema);


