import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trineo-tasks';

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database:\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found! Run: npm run seed');
    } else {
      for (const user of users) {
        console.log(`User: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password hash: ${user.password.substring(0, 20)}...`);
        console.log('');
      }

      // Test password for first user
      if (users.length > 0) {
        const testUser = users[0];
        const testPassword = 'anal@123';
        const isMatch = await bcrypt.compare(testPassword, testUser.password);
        console.log(`\n🔐 Testing password "${testPassword}" for ${testUser.email}:`);
        console.log(`   Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();


