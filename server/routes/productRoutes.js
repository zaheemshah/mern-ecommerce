import express from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  searchSuggestions,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadProductImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/search/suggestions', searchSuggestions);
router.get('/:id', getProduct);

router.post('/', protect, admin, uploadProductImages, createProduct);
router.put('/:id', protect, admin, uploadProductImages, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
