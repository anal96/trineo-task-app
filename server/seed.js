import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trineo-tasks';

const users = [
  {
    name: 'Anal',
    email: 'anal@trineo.com',
    password: 'anal@123'
  },
  {
    name: 'Fayiz',
    email: 'fayiz@trineo.com',
    password: 'fayiz@123'
  },
  {
    name: 'Noel',
    email: 'noel@trineo.com',
    password: 'noel@123'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing test users to fix double-hashed passwords
    const testEmails = users.map(u => u.email);
    await User.deleteMany({ email: { $in: testEmails } });
    console.log('🗑️  Cleared existing test users (to fix password hashing)');

    // Create users
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create user - password will be hashed automatically by User model's pre-save hook
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password // Model will hash this automatically
      });

      await user.save();
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n📝 Test Users Created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();

