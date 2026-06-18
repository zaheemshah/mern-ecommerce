import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart?.items?.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.title || 'product'}`,
        });
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0] || '',
        price,
        quantity: item.quantity,
      });
      totalAmount += price * item.quantity;

      product.stock -= item.quantity;
      product.soldCount += item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: req.body.shippingAddress,
      totalAmount,
      paymentStatus: 'paid',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus, paymentStatus: req.body.paymentStatus },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
