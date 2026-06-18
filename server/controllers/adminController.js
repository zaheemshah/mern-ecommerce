import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueData, recentOrders, customers] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalAmount' },
              avgOrderValue: { $avg: '$totalAmount' },
            },
          },
        ]),
        Order.find()
          .populate('user', 'name email')
          .sort('-createdAt')
          .limit(10),
        User.find({ role: 'user' }).select('name email createdAt').sort('-createdAt').limit(10),
      ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        avgOrderValue: revenueData[0]?.avgOrderValue || 0,
        monthlyRevenue,
        recentOrders,
        customers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};
