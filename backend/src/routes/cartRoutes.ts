import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { UserRole } from '../types';

const router = Router();
router.use(requireAuth, requireRole(UserRole.USER));

router.post('/add', addToCart);
router.get('/', getCart);
router.delete('/item/:id', removeFromCart);

export default router;