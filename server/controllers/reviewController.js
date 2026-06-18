import Review from '../models/Review.js';
import Product from '../models/Product.js';

const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const ratings =
    numReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews : 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: Math.round(ratings * 10) / 10,
    numReviews,
  });
};

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name profileImage')
      .sort('-createdAt');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    await updateProductRatings(productId);

    const populated = await Review.findById(review._id).populate('user', 'name profileImage');
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRatings(productId);

    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};
