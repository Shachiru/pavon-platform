import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { createOrder, getMyOrders, getAllOrders } from '../controllers/orderController';
import { UserRole } from '../types';

const router = Router();

router.use(requireAuth);
router.post('/', requireRole(UserRole.USER), createOrder);
router.get('/my', requireRole(UserRole.USER), getMyOrders);
router.get('/', requireRole(UserRole.ADMIN), getAllOrders);

export default router;