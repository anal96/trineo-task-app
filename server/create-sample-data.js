import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trineo-tasks';

async function createSampleData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the first user (Anal)
    const user = await User.findOne({ email: 'anal@trineo.com' });
    if (!user) {
      console.log('❌ User not found. Please run: npm run seed');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`📝 Creating sample data for: ${user.name}\n`);

    // Clear existing data for this user
    await Task.deleteMany({ userId: user._id });
    await Project.deleteMany({ userId: user._id });
    console.log('🗑️  Cleared existing tasks and projects\n');

    // Create Projects
    const projects = [
      { name: 'Website Redesign', type: 'Website', color: '#1E40AF' },
      { name: 'Mobile App', type: 'App Development', color: '#22C55E' },
      { name: 'Backend System', type: 'Backend', color: '#F59E0B' }
    ];

    const createdProjects = [];
    for (const projectData of projects) {
      const project = new Project({
        ...projectData,
        userId: user._id
      });
      await project.save();
      createdProjects.push(project);
      console.log(`✅ Created project: ${project.name}`);
    }

    // Create Tasks
    const tasks = [
      {
        title: 'Design Homepage',
        description: 'Create modern homepage design',
        projectId: createdProjects[0]._id,
        status: 'in-progress',
        priority: 'high',
        estimatedTime: 150, // 2h 30m
        progress: 75
      },
      {
        title: 'API Integration',
        description: 'Integrate REST API endpoints',
        projectId: createdProjects[1]._id,
        status: 'in-progress',
        priority: 'medium',
        estimatedTime: 105, // 1h 45m
        progress: 60
      },
      {
        title: 'Database Schema',
        description: 'Design and implement database schema',
        projectId: createdProjects[2]._id,
        status: 'in-progress',
        priority: 'high',
        estimatedTime: 195, // 3h 15m
        progress: 45
      },
      {
        title: 'User Authentication',
        description: 'Implement login and registration',
        projectId: createdProjects[1]._id,
        status: 'completed',
        priority: 'high',
        estimatedTime: 120,
        progress: 100
      },
      {
        title: 'Responsive Design',
        description: 'Make website mobile-friendly',
        projectId: createdProjects[0]._id,
        status: 'todo',
        priority: 'medium',
        estimatedTime: 180,
        progress: 0
      }
    ];

    for (const taskData of tasks) {
      const task = new Task({
        ...taskData,
        userId: user._id
      });
      await task.save();
      console.log(`✅ Created task: ${task.title}`);
    }

    // Update project stats
    for (const project of createdProjects) {
      const projectTasks = await Task.find({ projectId: project._id });
      project.totalTasks = projectTasks.length;
      project.tasksCompleted = projectTasks.filter(t => t.status === 'completed').length;
      await project.save();
    }

    console.log('\n✅ Sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Projects: ${createdProjects.length}`);
    console.log(`   Tasks: ${tasks.length}`);
    console.log(`   In Progress: ${tasks.filter(t => t.status === 'in-progress').length}`);
    console.log(`   Completed: ${tasks.filter(t => t.status === 'completed').length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData();


