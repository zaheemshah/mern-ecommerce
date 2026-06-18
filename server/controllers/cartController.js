import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    populate: { path: 'category', select: 'name slug' },
  });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'category', select: 'name slug' },
    });
  }
  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await getOrCreateCart(req.user._id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity < 1) {
      item.deleteOne();
    } else {
      const product = await Product.findById(item.product);
      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      item.quantity = quantity;
    }

    await cart.save();
    const updatedCart = await getOrCreateCart(req.user._id);
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();

    const updatedCart = await getOrCreateCart(req.user._id);
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
