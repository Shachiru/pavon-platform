import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';
import AppError from '../utils/AppError';
import {catchAsync} from '../utils/catchAsync';
import { OrderStatus } from '../types';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);
    const userId = req.user._id;

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();

    try {
        // Start transaction
        await session.startTransaction();

        // Fetch cart with populated products within transaction
        const cart = await Cart.findOne({user: userId})
            .populate('items.product')
            .session(session);

        if (!cart || cart.items.length === 0) {
            throw new AppError('Cart is empty', 400);
        }

        // Validate stock availability and prepare order items
        const items = [];
        const stockUpdates = [];

        for (const cartItem of cart.items) {
            const product = cartItem.product as any;

            if (!product) {
                throw new AppError(`Product not found`, 404);
            }

            // Check if product has enough stock
            if (product.stock < cartItem.quantity) {
                throw new AppError(
                    `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`,
                    400
                );
            }

            items.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: product.price,
            });

            stockUpdates.push({
                productId: product._id,
                quantity: cartItem.quantity,
            });
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Update stock for all products atomically
        for (const update of stockUpdates) {
            const result = await Product.findOneAndUpdate(
                {
                    _id: update.productId,
                    stock: { $gte: update.quantity } // Double-check stock is still available
                },
                { $inc: { stock: -update.quantity } },
                { session, new: true }
            );

            if (!result) {
                throw new AppError(
                    `Failed to update stock. Product may have been purchased by another user.`,
                    400
                );
            }
        }

        // Create the order
        const [order] = await Order.create(
            [{ user: userId, items, totalAmount }],
            { session }
        );

        // Clear the cart
        await Cart.deleteOne({ user: userId }, { session });

        // Commit the transaction
        await session.commitTransaction();

        // Populate order for response
        await order.populate('items.product');

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: { order }
        });

    } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        throw error;
    } finally {
        // End session
        session.endSession();
    }
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const orders = await Order.find({user: req.user._id}).sort({createdAt: -1});
    res.status(200).json({status: 'success', data: {orders}});
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Check authorization: user can only view their own orders, admin can view all
    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
        throw new AppError('You do not have permission to view this order', 403);
    }

    res.status(200).json({status: 'success', data: {order}});
});

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await Order.find().populate('user', 'name email').sort({createdAt: -1});
    res.status(200).json({status: 'success', data: {orders}});
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
        throw new AppError('Status is required', 400);
    }

    // Start a session for transaction
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Find the order
        const order = await Order.findById(orderId)
            .populate('items.product')
            .session(session);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check authorization
        const isAdmin = req.user.role === 'admin';
        const isOwner = order.user.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            throw new AppError('You do not have permission to update this order', 403);
        }

        const oldStatus = order.status;

        // If cancelling an order, restore stock
        if (status === 'cancelled' && oldStatus !== 'cancelled') {
            // Only allow cancellation if order is pending or confirmed
            if (!['pending', 'confirmed'].includes(oldStatus)) {
                throw new AppError(
                    `Cannot cancel order with status: ${oldStatus}. Only pending or confirmed orders can be cancelled.`,
                    400
                );
            }

            // Restore stock for all items
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }
        }

        // Update order status
        order.status = status;
        await order.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            status: 'success',
            message: `Order status updated to ${status}`,
            data: { order }
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const orderId = req.params.id;

    // Start a session for transaction
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // Find the order
        const order = await Order.findById(orderId)
            .populate('items.product')
            .session(session);

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user._id.toString()) {
            throw new AppError('You can only cancel your own orders', 403);
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            throw new AppError(
                `Cannot cancel order with status: ${order.status}`,
                400
            );
        }

        // Restore stock for all items
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        // Update order status to cancelled
        order.status = OrderStatus.CANCELLED;
        await order.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            status: 'success',
            message: 'Order cancelled successfully',
            data: { order }
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});
