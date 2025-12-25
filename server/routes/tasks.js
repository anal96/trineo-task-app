import express from 'express';
import { verifyToken } from './auth.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const { status, projectId } = req.query;
    const query = { userId: req.userId };
    
    if (status) query.status = status;
    if (projectId) query.projectId = projectId;

    const tasks = await Task.find(query)
      .populate('projectId', 'name type color')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
      .populate('projectId', 'name type color');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, projectId, status, priority, estimatedTime, dueDate } = req.body;

    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      projectId,
      userId: req.userId,
      status: status || 'todo',
      priority: priority || 'medium',
      estimatedTime: estimatedTime || 0,
      dueDate: dueDate || null
    });

    await task.save();
    await task.populate('projectId', 'name type color');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('projectId', 'name type color');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // If status changed to completed, set completedAt
    if (req.body.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
      await task.save();
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    
    // Calculate average progress from actual task progress values
    let totalProgress = 0;
    if (tasks.length > 0) {
      const totalProgressSum = tasks.reduce((sum, task) => {
        // If task is completed, count as 100%, otherwise use actual progress
        if (task.status === 'completed') {
          return sum + 100;
        }
        return sum + (task.progress || 0);
      }, 0);
      totalProgress = Math.round(totalProgressSum / tasks.length);
    }
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      totalProgress: totalProgress
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

