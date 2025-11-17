import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User';
import { UserRole } from '../types';

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('✅ Connected to MongoDB');

        // Admin user details
        const adminEmail = 'admin@example.com';
        const adminPassword = 'Admin123!';
        const adminName = 'Admin User';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`👤 Name: ${existingAdmin.name}`);
            console.log(`🔑 Role: ${existingAdmin.role}`);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: UserRole.ADMIN,
        });

        console.log('\n✅ Admin user created successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:    ', adminEmail);
        console.log('🔒 Password: ', adminPassword);
        console.log('👤 Name:     ', adminName);
        console.log('🔑 Role:     ', admin.role);
        console.log('═══════════════════════════════════════\n');
        console.log('⚠️  IMPORTANT: Change this password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();

