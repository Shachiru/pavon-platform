import { Request, Response } from 'express';
import Product from '../models/Product';
import cloudinary from '../config/cloudinary';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const uploadImages = async (files: any[]) => {
    const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: 'pavon/products' })
    );
    const results = await Promise.all(uploadPromises);
    return results.map(r => r.secure_url);
};

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

    const { name, description, price, category, stock } = req.body;
    const images = await uploadImages(req.files as any[]);

    const product = await Product.create({
        name, description, price, category, stock, images,
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

    Object.assign(product, req.body);
    if (req.files) {
        product.images = await uploadImages(req.files as any[]);
    }
    await product.save();

    res.status(200).json({ status: 'success', data: { product } });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await verifyProductOwnership(req, req.params.id);

    await product.deleteOne();
    res.status(204).json({ status: 'success', data: null });
});