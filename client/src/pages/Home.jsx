import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI, cartAPI, wishlistAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const { isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [featuredRes, newRes, bestRes, catRes] = await Promise.all([
        productAPI.getFeatured(),
        productAPI.getNewArrivals(),
        productAPI.getBestSellers(),
        categoryAPI.getAll(),
      ]);
      setFeatured(featuredRes.data.products);
      setNewArrivals(newRes.data.products);
      setBestSellers(bestRes.data.products);
      setCategories(catRes.data.categories);

      if (isAuthenticated) {
        const wishRes = await wishlistAPI.get();
        setWishlistIds(wishRes.data.wishlist.products.map((p) => p._id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) return alert('Please login to add items to cart');
    try {
      await cartAPI.add(productId);
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) return alert('Please login to use wishlist');
    try {
      if (wishlistIds.includes(productId)) {
        await wishlistAPI.remove(productId);
        setWishlistIds((ids) => ids.filter((id) => id !== productId));
      } else {
        await wishlistAPI.add(productId);
        setWishlistIds((ids) => [...ids, productId]);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const renderSection = (title, products, link) => (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={link} className="view-all">View All →</Link>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlistIds.includes(product._id)}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends with fast delivery and secure checkout.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </section>

      <section className="section container">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/products?category=${cat._id}`} className="category-card">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="container">
        {renderSection('Featured Products', featured, '/products?featured=true')}
        {renderSection('New Arrivals', newArrivals, '/products?sort=-createdAt')}
        {renderSection('Best Sellers', bestSellers, '/products?sort=-soldCount')}
      </div>
    </div>
  );
}

export default Home;
