import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../api/services';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, getEffectivePrice, getImageUrl } from '../utils/helpers';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.update(itemId, quantity);
      setCart(data.cart);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartAPI.remove(itemId);
      setCart(data.cart);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCart} />;

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
    0
  );

  return (
    <div className="container cart-page">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={getImageUrl(item.product?.images?.[0])} alt={item.product?.title} />
                <div className="cart-item-info">
                  <h3>{item.product?.title}</h3>
                  <p>{formatPrice(getEffectivePrice(item.product))}</p>
                  <div className="quantity-selector">
                    <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <p>{formatPrice(getEffectivePrice(item.product) * item.quantity)}</p>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: <strong>{formatPrice(subtotal)}</strong></p>
            <p>Shipping: <strong>Free</strong></p>
            <p className="total">Total: <strong>{formatPrice(subtotal)}</strong></p>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
