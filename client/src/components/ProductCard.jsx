import { Link } from 'react-router-dom';
import { formatPrice, getEffectivePrice, getImageUrl } from '../utils/helpers';

function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }) {
  const price = getEffectivePrice(product);
  const hasDiscount = product.discountPrice > 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-image">
      <img src={product.images?.[0]} alt={product.title} loading="lazy" />
        {hasDiscount && <span className="badge sale">Sale</span>}
        {product.isFeatured && <span className="badge featured">Featured</span>}
      </Link>
      <div className="product-card-body">
        <p className="product-category">{product.category?.name}</p>
        <Link to={`/products/${product._id}`}>
          <h3>{product.title}</h3>
        </Link>
        <div className="product-rating">
          {'★'.repeat(Math.round(product.ratings || 0))}
          <span>({product.numReviews || 0})</span>
        </div>
        <div className="product-price">
          <span className="current">{formatPrice(price)}</span>
          {hasDiscount && <span className="original">{formatPrice(product.price)}</span>}
        </div>
        <div className="product-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onAddToCart?.(product._id)}>
            Add to Cart
          </button>
          <button
            type="button"
            className={`btn btn-icon ${isInWishlist ? 'active' : ''}`}
            onClick={() => onToggleWishlist?.(product._id)}
            aria-label="Toggle wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
