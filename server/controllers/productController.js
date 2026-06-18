import Product from '../models/Product.js';
import { APIFeatures } from '../utils/apiFeatures.js';

const buildImagePaths = (files) =>
  files?.map((file) => `/uploads/${file.filename}`) || [];

export const getProducts = async (req, res, next) => {
  try {
    const baseQuery = Product.find().populate('category', 'name slug');
    const features = new APIFeatures(baseQuery, req.query).search().filter().sort().limitFields().paginate();
    const products = await features.query;
    const total = await Product.countDocuments(
      req.query.keyword
        ? {
            $or: [
              { title: { $regex: req.query.keyword, $options: 'i' } },
              { description: { $regex: req.query.keyword, $options: 'i' } },
              { brand: { $regex: req.query.keyword, $options: 'i' } },
            ],
          }
        : {}
    );

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(req.query.page) || 1,
      pages: Math.ceil(total / (Number(req.query.limit) || 12)),
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .limit(4)
      .populate('category', 'name slug');

    res.status(200).json({ success: true, product, related });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8).populate('category', 'name slug');
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find().sort('-createdAt').limit(8).populate('category', 'name slug');
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true }).sort('-soldCount').limit(8).populate('category', 'name slug');
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const searchSuggestions = async (req, res, next) => {
  try {
    const keyword = req.query.q;
    if (!keyword) return res.status(200).json({ success: true, suggestions: [] });

    const suggestions = await Product.find({
      title: { $regex: keyword, $options: 'i' },
    })
      .select('title images price discountPrice')
      .limit(5);

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

const parseProductBody = (body) => ({
  ...body,
  price: Number(body.price),
  discountPrice: Number(body.discountPrice) || 0,
  stock: Number(body.stock),
  isFeatured: body.isFeatured === 'true' || body.isFeatured === true,
  isBestSeller: body.isBestSeller === 'true' || body.isBestSeller === true,
});

export const createProduct = async (req, res, next) => {
  try {
    const images = buildImagePaths(req.files);
    const product = await Product.create({ ...parseProductBody(req.body), images });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newImages = buildImagePaths(req.files);
    const updates = parseProductBody(req.body);
    if (newImages.length) {
      updates.images = [...(product.images || []), ...newImages];
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};
