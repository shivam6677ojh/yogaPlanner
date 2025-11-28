// Migration script to update existing users with new security fields
// Run this once after implementing the security updates

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update all existing users
    const result = await User.updateMany(
      { isVerified: { $exists: false } },
      {
        $set: {
          isVerified: true, // Mark existing users as verified
          loginAttempts: 0,
        },
        $unset: {
          verificationToken: "",
          verificationTokenExpire: "",
          resetPasswordToken: "",
          resetPasswordExpire: "",
          lockUntil: ""
        }
      }
    );

    console.log(`✅ Migration completed: ${result.modifiedCount} users updated`);
    
    // Display summary
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    console.log(`\nSummary:`);
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Verified Users: ${verifiedUsers}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();
