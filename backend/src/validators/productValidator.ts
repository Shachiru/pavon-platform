import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    category: z.string().min(2),
    stock: z.number().int().min(0),
    images: z.array(z.string().url()).min(1, 'At least one image URL is required').max(5, 'Maximum 5 images allowed'),
});