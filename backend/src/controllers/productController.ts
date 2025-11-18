import { Request, Response } from 'express';
import Product from '../models/Product';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';

const verifyProductOwnership = async (req: Request, productId: string) => {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const product = await Product.findById(productId);
    if (!product) throw new AppError('Product not found', 404);

    if (product.seller.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized', 403);
    }

    return product;
};

export const createProduct = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authenticated', 401);
    const userId = req.user._id;

    const { name, description, price, category, stock, images } = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        images,
        seller: userId,
    });

    res.status(201).json({ status: 'success', data: { product } });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, category } = req.query;
    const query: any = {};

    if (search) query.$text = { $search: search as string };
    if (category) query.category = category;

    const products = await Product.find(query)
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: products.length,
        total,
        data: { products },
    });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await verifyProductOwnership(req, req.params.id);

    const { name, description, price, category, stock, images } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (images !== undefined) product.images = images;

    await product.save();

    res.status(200).json({ status: 'success', data: { product } });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await verifyProductOwnership(req, req.params.id);

    await product.deleteOne();
    res.status(204).json({ status: 'success', data: null });
});