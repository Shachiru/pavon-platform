import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { addToCart, getCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cartController';
import { UserRole } from '../types';

const router = Router();
router.use(requireAuth, requireRole(UserRole.USER));

router.post('/add', addToCart);
router.get('/', getCart);
router.patch('/item/:id', updateCartItem);
router.delete('/item/:id', removeFromCart);
router.delete('/clear', clearCart);

export default router;