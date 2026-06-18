import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: 'products',
    populate: { path: 'category', select: 'name slug' },
  });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' },
    });
  }
  return wishlist;
};

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updated = await getOrCreateWishlist(req.user._id);
    res.status(200).json({ success: true, wishlist: updated });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== req.params.productId);
    await wishlist.save();

    const updated = await getOrCreateWishlist(req.user._id);
    res.status(200).json({ success: true, wishlist: updated });
  } catch (error) {
    next(error);
  }
};
