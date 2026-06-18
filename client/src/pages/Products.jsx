import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI, cartAPI, wishlistAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Products() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const minPrice = searchParams.get('price[gte]') || '';
  const maxPrice = searchParams.get('price[lte]') || '';

  const fetchProducts = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: currentPage, limit: 12, sort };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (minPrice) params['price[gte]'] = minPrice;
      if (maxPrice) params['price[lte]'] = maxPrice;

      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPage(data.page);
      setPages(data.pages);

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
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [keyword, category, sort, minPrice, maxPrice, isAuthenticated]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

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

  return (
    <div className="container products-page">
      <h1>All Products</h1>
      <div className="products-layout">
        <aside className="filters">
          <h3>Filters</h3>
          <label>
            Category
            <select value={category} onChange={(e) => updateFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>
            Sort By
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="-createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratings">Top Rated</option>
              <option value="-soldCount">Best Selling</option>
            </select>
          </label>
          <label>
            Min Price
            <input type="number" value={minPrice} onChange={(e) => updateFilter('price[gte]', e.target.value)} />
          </label>
          <label>
            Max Price
            <input type="number" value={maxPrice} onChange={(e) => updateFilter('price[lte]', e.target.value)} />
          </label>
        </aside>
        <div className="products-main">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => fetchProducts(page)} />
          ) : (
            <>
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
              {products.length === 0 && <p className="empty-state">No products found.</p>}
              <Pagination page={page} pages={pages} onPageChange={fetchProducts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
