import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import AppError from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const addToCart = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('User not authenticated', 401);

    const { productId, quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
        throw new AppError('Quantity must be at least 1', 400);
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) throw new AppError('Product not found', 404);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    const newQuantity = itemIndex > -1
        ? cart.items[itemIndex].quantity + quantity
        : quantity;

    // Validate stock availability
    if (product.stock < newQuantity) {
        throw new AppError(
            `Insufficient stock. Available: ${product.stock}, Requested: ${newQuantity}`,
            400
        );
    }

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = newQuantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        data: { cart }
    });
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('User not authenticated', 401);

    const { quantity } = req.body;
    const itemId = req.params.id;

    if (!quantity || quantity < 1) {
        throw new AppError('Quantity must be at least 1', 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new AppError('Cart not found', 404);

    const itemIndex = cart.items.findIndex(
        (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
        throw new AppError('Item not found in cart', 404);
    }

    // Check stock availability
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
        throw new AppError(
            `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
            400
        );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
        status: 'success',
        message: 'Cart item updated successfully',
        data: { cart }
    });
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

    res.status(200).json({
        status: 'success',
        message: 'Item removed from cart successfully',
        data: { cart }
    });
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('User not authenticated', 401);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return res.status(200).json({
            status: 'success',
            message: 'Cart is already empty',
            data: { cart: { items: [] } }
        });
    }

    // Clear items by removing all elements
    cart.items.splice(0, cart.items.length);
    await cart.save();

    res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully',
        data: { cart }
    });
});