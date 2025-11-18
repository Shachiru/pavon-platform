import {Request, Response} from 'express';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';
import AppError from '../utils/AppError';
import {catchAsync} from '../utils/catchAsync';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);
    const userId = req.user._id;

    const cart = await Cart.findOne({user: userId}).populate('items.product');
    if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400);

    const items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: (item.product as any).price,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Reduce stock
    for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {$inc: {stock: -item.quantity}});
    }

    const order = await Order.create({user: userId, items, totalAmount});
    await Cart.deleteOne({user: userId});

    res.status(201).json({status: 'success', data: {order}});
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const orders = await Order.find({user: req.user._id}).sort({createdAt: -1});
    res.status(200).json({status: 'success', data: {orders}});
});

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await Order.find().populate('user', 'name email').sort({createdAt: -1});
    res.status(200).json({status: 'success', data: {orders}});
});