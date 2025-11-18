import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().positive('Price must be positive'),
    category: z.enum(['Phones', 'Laptops', 'Tablets', 'Smartwatches', 'Headphones', 'Accessories', 'Other'], {
        errorMap: () => ({ message: 'Invalid category' })
    }),
    brand: z.string().optional(),
    stock: z.coerce.number().int().nonnegative('Stock must be non-negative'),
    images: z.array(z.string()).optional().default([]),
    specifications: z.object({
        processor: z.string().optional(),
        ram: z.string().optional(),
        storage: z.string().optional(),
        display: z.string().optional(),
        battery: z.string().optional(),
        camera: z.string().optional(),
        os: z.string().optional(),
        color: z.string().optional(),
        warranty: z.string().optional(),
    }).optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    reviewCount: z.coerce.number().int().nonnegative().optional(),
    featured: z.boolean().optional(),
    discount: z.coerce.number().min(0).max(100).optional(),
});