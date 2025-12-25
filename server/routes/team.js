import express from 'express';
import { verifyToken } from './auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all team members with their stats
router.get('/members', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}).select('name email avatar createdAt');
    
    // Get stats for each user
    const membersWithStats = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ userId: user._id });
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
        const todoTasks = tasks.filter(t => t.status === 'todo');
        
        // Calculate total progress (average of all task progress)
        const totalProgress = tasks.length > 0
          ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length)
          : 0;
        
        // Calculate average completion time (mock for now)
        const averageCompletionTime = completedTasks.length > 0
          ? Math.round(completedTasks.length * 2.5) // Mock: 2.5 hours average
          : 0;
        
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          stats: {
            totalTasks: tasks.length,
            completedTasks: completedTasks.length,
            inProgressTasks: inProgressTasks.length,
            todoTasks: todoTasks.length,
            totalProgress,
            averageCompletionTime,
          },
        };
      })
    );
    
    res.json(membersWithStats);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get team statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { timeRange = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(0); // All time
    }
    
    const users = await User.find({});
    const allTasks = await Task.find({
      createdAt: { $gte: startDate },
    });
    
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    
    // Calculate average progress across all users
    const userProgresses = await Promise.all(
      users.map(async (user) => {
        const userTasks = await Task.find({ userId: user._id, createdAt: { $gte: startDate } });
        if (userTasks.length === 0) return 0;
        return userTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / userTasks.length;
      })
    );
    
    const averageProgress = userProgresses.length > 0
      ? Math.round(userProgresses.reduce((sum, p) => sum + p, 0) / userProgresses.length)
      : 0;
    
    // Find top performer
    const userStats = await Promise.all(
      users.map(async (user) => {
        const userTasks = await Task.find({ userId: user._id, createdAt: { $gte: startDate } });
        const completed = userTasks.filter(t => t.status === 'completed').length;
        const total = userTasks.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        return { userId: user._id, name: user.name, progress, completed, total };
      })
    );
    
    const topPerformer = userStats.length > 0
      ? userStats.reduce((top, current) => (current.progress > top.progress ? current : top), userStats[0])
      : null;
    
    // Calculate team efficiency (completion rate)
    const teamEfficiency = allTasks.length > 0
      ? Math.round((completedTasks.length / allTasks.length) * 100)
      : 0;
    
    res.json({
      totalMembers: users.length,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      averageProgress,
      topPerformer: topPerformer?.name || 'N/A',
      teamEfficiency,
    });
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get individual member stats
router.get('/members/:memberId/stats', verifyToken, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { timeRange = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(0);
    }
    
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const tasks = await Task.find({
      userId: memberId,
      createdAt: { $gte: startDate },
    });
    
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const todoTasks = tasks.filter(t => t.status === 'todo');
    
    const totalProgress = tasks.length > 0
      ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length)
      : 0;
    
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      stats: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        todoTasks: todoTasks.length,
        totalProgress,
      },
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


