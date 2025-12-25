import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
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

// Update project stats when task status changes
taskSchema.post('save', async function() {
  const Project = mongoose.model('Project');
  const project = await Project.findById(this.projectId);
  
  if (project) {
    const tasks = await mongoose.model('Task').find({ projectId: this.projectId });
    project.totalTasks = tasks.length;
    project.tasksCompleted = tasks.filter(t => t.status === 'completed').length;
    await project.save();
  }
});

export default mongoose.model('Task', taskSchema);


