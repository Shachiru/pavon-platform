import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const resetAdminPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('✅ Connected to MongoDB');

        // Admin user details
        const adminEmail = 'admin@example.com';
        const newPassword = 'Admin123!';

        // Find admin user
        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            console.log('❌ Admin user not found!');
            console.log('Run: npm run create-admin first');
            process.exit(1);
        }

        console.log('\n📋 Current Admin Details:');
        console.log('📧 Email:', admin.email);
        console.log('👤 Name:', admin.name);
        console.log('🔑 Role:', admin.role);
        console.log('🔐 Has Password:', !!admin.password);

        // Reset password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        admin.password = hashedPassword;
        await admin.save({ validateBeforeSave: false });

        console.log('\n✅ Password reset successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:    ', adminEmail);
        console.log('🔒 Password: ', newPassword);
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting password:', error);
        process.exit(1);
    }
};

resetAdminPassword();

