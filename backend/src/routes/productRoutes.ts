import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import { validate } from '../middleware/validate';
import { productSchema } from '../validators/productValidator';
import { UserRole } from '../types';

const router = Router();

// Public routes - No authentication required
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected admin routes - Requires authentication AND admin role
router.post('/', requireAuth, requireRole(UserRole.ADMIN), validate(productSchema), createProduct);
router.put('/:id', requireAuth, requireRole(UserRole.ADMIN), validate(productSchema), updateProduct);
router.delete('/:id', requireAuth, requireRole(UserRole.ADMIN), deleteProduct);

export default router;