import express from 'express';
import { body } from 'express-validator';
import {
  getProductReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post(
  '/',
  protect,
  [
    body('productId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').trim().notEmpty(),
    validate,
  ],
  createReview
);
router.delete('/:id', protect, deleteReview);

export default router;
