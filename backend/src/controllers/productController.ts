import { Request, Response } from 'express';
import Product from '../models/Product';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { UserRole, ProductQuery, CreateProductBody, UpdateProductBody, SortOption } from '../types';

/**
 * Verify admin access
 * Note: This is a safety check. The route is already protected by requireAuth + requireRole middleware
 */
const verifyAdminAccess = (req: Request) => {
    if (!req.user) throw new AppError('Not authenticated', 401);
    if (req.user.role !== UserRole.ADMIN) {
        throw new AppError('Only admins can manage products', 403);
    }
};

export const createProduct = catchAsync(async (req: Request<{}, {}, CreateProductBody>, res: Response) => {
    verifyAdminAccess(req);
    const adminId = req.user!._id;

    const {
        name,
        description,
        price,
        category,
        brand,
        stock,
        images,
        specifications,
        rating,
        reviewCount,
        featured,
        discount
    } = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        category,
        brand,
        stock,
        images: images || [],
        specifications: specifications || {},
        rating: rating || 0,
        reviewCount: reviewCount || 0,
        featured: featured || false,
        discount: discount || 0,
        seller: adminId, // Admin who created the product
    });

    res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: { product }
    });
});

export const getProducts = catchAsync(async (req: Request<{}, {}, {}, ProductQuery>, res: Response) => {
    const {
        page = '1',
        limit = '10',
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        featured,
        sortBy = 'createdAt',
        order = 'desc'
    } = req.query;

    const query: any = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (featured === 'true') query.featured = true;

    // Price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: SortOption = {
        [sortBy]: sortOrder
    };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const products = await Product.find(query)
        .populate('seller', 'name email')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort(sortOptions);

    const total = await Product.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: products.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        data: { products },
    });
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

export const updateProduct = catchAsync(async (req: Request<{ id: string }, {}, UpdateProductBody>, res: Response) => {
    verifyAdminAccess(req);

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const {
        name,
        description,
        price,
        category,
        brand,
        stock,
        images,
        specifications,
        rating,
        reviewCount,
        featured,
        discount
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (stock !== undefined) product.stock = stock;
    if (images !== undefined) product.images = images;
    if (specifications !== undefined) product.specifications = specifications;
    if (rating !== undefined) product.rating = rating;
    if (reviewCount !== undefined) product.reviewCount = reviewCount;
    if (featured !== undefined) product.featured = featured;
    if (discount !== undefined) product.discount = discount;

    await product.save();

    res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: { product }
    });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    verifyAdminAccess(req);

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    await product.deleteOne();
    res.status(204).json({ status: 'success', data: null });
});