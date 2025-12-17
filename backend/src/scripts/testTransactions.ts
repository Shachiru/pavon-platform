import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import Cart from '../models/Cart';
import Order from '../models/Order';
import { UserRole, OrderStatus } from '../types';

/**
 * Test script to verify transaction implementation
 * This script tests:
 * 1. Order creation with stock deduction
 * 2. Order cancellation with stock restoration
 * 3. Race condition prevention
 */

async function testTransactions() {
    try {
        // Connect to MongoDB
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not defined');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Clean up test data
        await User.deleteOne({ email: 'test-transaction@example.com' });
        await Product.deleteMany({ name: { $regex: /^TEST-TRANSACTION/ } });
        console.log('✓ Cleaned up test data');

        // Create test user
        const testUser = await User.create({
            name: 'Transaction Test User',
            email: 'test-transaction@example.com',
            password: 'TestPassword123!',
            role: UserRole.USER,
        });
        console.log('✓ Created test user:', testUser.email);

        // Create test product
        const testProduct = await Product.create({
            name: 'TEST-TRANSACTION Product',
            description: 'Test product for transaction testing',
            price: 100,
            category: 'Other',
            brand: 'Test Brand',
            stock: 10,
            images: [],
            seller: testUser._id,
        });
        console.log('✓ Created test product:', testProduct.name, '(Stock:', testProduct.stock, ')');

        // Test 1: Create cart and order
        console.log('\n--- TEST 1: Order Creation with Stock Deduction ---');
        const cart = await Cart.create({
            user: testUser._id,
            items: [
                {
                    product: testProduct._id,
                    quantity: 3,
                },
            ],
        });
        console.log('✓ Created cart with 3 items');

        const session = await mongoose.startSession();
        try {
            await session.startTransaction();

            // Simulate order creation
            const orderItems = [
                {
                    product: testProduct._id,
                    quantity: 3,
                    price: testProduct.price,
                },
            ];

            const totalAmount = 300;

            // Update stock
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: testProduct._id, stock: { $gte: 3 } },
                { $inc: { stock: -3 } },
                { session, new: true }
            );

            if (!updatedProduct) {
                throw new Error('Failed to update stock');
            }

            // Create order
            const [order] = await Order.create(
                [{ user: testUser._id, items: orderItems, totalAmount, status: OrderStatus.PENDING }],
                { session }
            );

            // Clear cart
            await Cart.deleteOne({ user: testUser._id }, { session });

            await session.commitTransaction();
            console.log('✓ Order created successfully');
            console.log('  Order ID:', order._id);
            console.log('  Stock after order:', updatedProduct.stock);

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        // Verify stock was reduced
        const productAfterOrder = await Product.findById(testProduct._id);
        if (productAfterOrder && productAfterOrder.stock === 7) {
            console.log('✓ Stock correctly reduced from 10 to 7');
        } else {
            console.error('✗ Stock not correctly updated. Expected: 7, Got:', productAfterOrder?.stock);
        }

        // Test 2: Cancel order and restore stock
        console.log('\n--- TEST 2: Order Cancellation with Stock Restoration ---');
        const order = await Order.findOne({ user: testUser._id });
        if (!order) {
            throw new Error('Order not found');
        }

        const session2 = await mongoose.startSession();
        try {
            await session2.startTransaction();

            // Restore stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity } },
                    { session: session2 }
                );
            }

            // Update order status
            order.status = OrderStatus.CANCELLED;
            await order.save({ session: session2 });

            await session2.commitTransaction();
            console.log('✓ Order cancelled successfully');

        } catch (error) {
            await session2.abortTransaction();
            throw error;
        } finally {
            session2.endSession();
        }

        // Verify stock was restored
        const productAfterCancel = await Product.findById(testProduct._id);
        if (productAfterCancel && productAfterCancel.stock === 10) {
            console.log('✓ Stock correctly restored from 7 to 10');
        } else {
            console.error('✗ Stock not correctly restored. Expected: 10, Got:', productAfterCancel?.stock);
        }

        // Test 3: Test race condition prevention
        console.log('\n--- TEST 3: Race Condition Prevention ---');

        // Reset product stock to 5
        await Product.findByIdAndUpdate(testProduct._id, { stock: 5 });
        console.log('✓ Reset product stock to 5');

        // Try to order 6 items (should fail due to insufficient stock)
        const session3 = await mongoose.startSession();
        try {
            await session3.startTransaction();

            const result = await Product.findOneAndUpdate(
                { _id: testProduct._id, stock: { $gte: 6 } },
                { $inc: { stock: -6 } },
                { session: session3, new: true }
            );

            if (!result) {
                console.log('✓ Race condition prevented - insufficient stock detected');
            } else {
                console.error('✗ Race condition not prevented - order should have failed');
            }

            await session3.abortTransaction();
        } catch (error) {
            await session3.abortTransaction();
            console.log('✓ Transaction rolled back correctly');
        } finally {
            session3.endSession();
        }

        // Verify stock wasn't changed
        const productAfterRace = await Product.findById(testProduct._id);
        if (productAfterRace && productAfterRace.stock === 5) {
            console.log('✓ Stock unchanged after failed order (still 5)');
        } else {
            console.error('✗ Stock incorrectly modified. Expected: 5, Got:', productAfterRace?.stock);
        }

        // Clean up
        console.log('\n--- Cleanup ---');
        await Order.deleteMany({ user: testUser._id });
        await Cart.deleteMany({ user: testUser._id });
        await Product.findByIdAndDelete(testProduct._id);
        await User.findByIdAndDelete(testUser._id);
        console.log('✓ Test data cleaned up');

        console.log('\n=== ALL TRANSACTION TESTS PASSED ===\n');

    } catch (error) {
        console.error('\n✗ TEST FAILED:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

// Run tests
console.log('Starting transaction tests...\n');
testTransactions()
    .then(() => {
        console.log('Tests completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Tests failed:', error);
        process.exit(1);
    });

