import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, getEffectivePrice, getImageUrl } from '../utils/helpers';

function ProductDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const [productRes, reviewRes] = await Promise.all([
        productAPI.getOne(id),
        reviewAPI.getByProduct(id),
      ]);
      setProduct(productRes.data.product);
      setRelated(productRes.data.related);
      setReviews(reviewRes.data.reviews);

      if (isAuthenticated) {
        const wishRes = await wishlistAPI.get();
        setInWishlist(wishRes.data.wishlist.products.some((p) => p._id === id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return alert('Please login to add items to cart');
    try {
      await cartAPI.add(id, quantity);
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return alert('Please login to use wishlist');
    try {
      if (inWishlist) {
        await wishlistAPI.remove(id);
        setInWishlist(false);
      } else {
        await wishlistAPI.add(id);
        setInWishlist(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.create({ productId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProduct} />;
  if (!product) return null;

  const price = getEffectivePrice(product);

  return (
    <div className="container product-details">
      <div className="product-details-grid">
        <div className="product-gallery">
          <img src={getImageUrl(product.images?.[selectedImage])} alt={product.title} className="main-image" />
          <div className="thumbnails">
            {(product.images?.length ? product.images : ['']).map((img, idx) => (
              <button key={idx} type="button" onClick={() => setSelectedImage(idx)}>
                <img src={getImageUrl(img)} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="product-info">
          <p className="product-category">{product.category?.name}</p>
          <h1>{product.title}</h1>
          <div className="product-rating">{'★'.repeat(Math.round(product.ratings))} ({product.numReviews} reviews)</div>
          <div className="product-price-lg">
            <span>{formatPrice(price)}</span>
            {product.discountPrice > 0 && <span className="original">{formatPrice(product.price)}</span>}
          </div>
          <p>{product.description}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
          <div className="quantity-selector">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="product-actions-lg">
            <button type="button" className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock < 1}>
              Add to Cart
            </button>
            <button type="button" className={`btn btn-outline ${inWishlist ? 'active' : ''}`} onClick={handleWishlist}>
              {inWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        {isAuthenticated && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label>
              Rating
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </label>
            <textarea
              placeholder="Write your review..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <strong>{review.user?.name}</strong>
              <span>{'★'.repeat(review.rating)}</span>
              <p>{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p>No reviews yet.</p>}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <h2>Related Products</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} onAddToCart={() => cartAPI.add(p._id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
