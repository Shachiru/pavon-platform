import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder } from '../controllers/orderController';
import { UserRole } from '../types';

const router = Router();

router.use(requireAuth);
router.post('/', requireRole(UserRole.USER), createOrder);
router.get('/my', requireRole(UserRole.USER), getMyOrders);
router.post('/:id/cancel', requireRole(UserRole.USER), cancelOrder);
router.patch('/:id/status', updateOrderStatus); // Both admin and user (owner) can update
router.get('/:id', getOrderById); // Both admin and order owner can view
router.get('/', requireRole(UserRole.ADMIN), getAllOrders);

export default router;