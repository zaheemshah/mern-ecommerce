import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Product title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual('effectivePrice').get(function effectivePrice() {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

const Product = mongoose.model('Product', productSchema);
export default Product;
