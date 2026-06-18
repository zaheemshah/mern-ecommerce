import { useEffect, useState } from 'react';
import { wishlistAPI, cartAPI } from '../api/services';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await wishlistAPI.get();
      setProducts(data.wishlist.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.add(productId);
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={fetchWishlist} />;

  return (
    <div className="container">
      <h1>My Wishlist</h1>
      {products.length === 0 ? (
        <p className="empty-state">Your wishlist is empty.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleRemove}
              isInWishlist
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
