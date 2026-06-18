import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/all', admin, getAllOrders);
router.get('/:id', getOrder);
router.put('/:id', admin, updateOrderStatus);

export default router;
