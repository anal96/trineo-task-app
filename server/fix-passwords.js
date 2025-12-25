import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trineo-tasks';

const users = [
  { email: 'anal@trineo.com', password: 'anal@123' },
  { email: 'fayiz@trineo.com', password: 'fayiz@123' },
  { email: 'noel@trineo.com', password: 'noel@123' }
];

async function fixPasswords() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    for (const userData of users) {
      const user = await User.findOne({ email: userData.email });
      
      if (!user) {
        console.log(`⚠️  User ${userData.email} not found, creating...`);
        const newUser = new User({
          name: userData.email.split('@')[0].charAt(0).toUpperCase() + userData.email.split('@')[0].slice(1),
          email: userData.email,
          password: userData.password
        });
        await newUser.save();
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`🔧 Fixing password for: ${userData.email}`);
        // Set the plain password - pre-save hook will hash it
        // Use set() to ensure it's marked as modified
        user.set('password', userData.password);
        // Force update the updatedAt timestamp
        user.updatedAt = new Date();
        await user.save();
        console.log(`✅ Fixed password for: ${userData.email}`);
      }
    }

    console.log('\n✅ All passwords fixed!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(u => {
      console.log(`   Email: ${u.email}`);
      console.log(`   Password: ${u.password}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixPasswords();

