import User from '../models/User.js';
import Order from '../models/Order.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';

export const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.address !== undefined) {
      updates.address =
        typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
    }

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const [orders, wishlist, cart] = await Promise.all([
      Order.find({ user: req.user._id }).sort('-createdAt').limit(5),
      Wishlist.findOne({ user: req.user._id }).populate('products'),
      Cart.findOne({ user: req.user._id }).populate('items.product'),
    ]);

    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const totalSpent = await Order.aggregate([
      { $match: { user: req.user._id, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        recentOrders: orders,
        wishlistCount: wishlist?.products?.length || 0,
        cartCount: cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
