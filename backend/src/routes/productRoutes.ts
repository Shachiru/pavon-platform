import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../middleware/auth';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController';
import { validate } from '../middleware/validate';
import { productSchema } from '../validators/productValidator';
import { UserRole } from '../types';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.use(requireAuth);
router.post('/', requireRole(UserRole.ADMIN), upload.array('images', 5), validate(productSchema), createProduct);
router.get('/', getProducts);
router.put('/:id', requireRole(UserRole.ADMIN), upload.array('images', 5), updateProduct);
router.delete('/:id', requireRole(UserRole.ADMIN), deleteProduct);

export default router;