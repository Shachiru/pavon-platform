import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController';
import { validate } from '../middleware/validate';
import { productSchema } from '../validators/productValidator';
import { UserRole } from '../types';

const router = Router();

router.use(requireAuth);
router.post('/', requireRole(UserRole.ADMIN), validate(productSchema), createProduct);
router.get('/', getProducts);
router.put('/:id', requireRole(UserRole.ADMIN), updateProduct);
router.delete('/:id', requireRole(UserRole.ADMIN), deleteProduct);

export default router;