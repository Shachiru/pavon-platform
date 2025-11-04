import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import AppError from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const addToCart = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('User not authenticated', 401);

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) throw new AppError('Product not found', 404);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ status: 'success', data: { cart } });
});

export const getCart = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('User not authenticated', 401);

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.status(200).json({
        status: 'success',
        data: { cart: cart || { items: [] } },
    });
});

export const removeFromCart = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('User not authenticated', 401);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new AppError('Cart not found', 404);

    const itemIndex = cart.items.findIndex(
        (item) => item._id?.toString() === req.params.id
    );

    if (itemIndex === -1) {
        throw new AppError('Item not found in cart', 404);
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ status: 'success', data: { cart } });
});