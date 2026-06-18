import express from 'express';
import { updateProfile, getUserDashboard } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/dashboard', getUserDashboard);
router.put('/profile', uploadProfileImage, updateProfile);

export default router;
