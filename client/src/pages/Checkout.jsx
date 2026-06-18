import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, getEffectivePrice } from '../utils/helpers';

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    cartAPI.get().then(({ data }) => {
      setCart(data.cart);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await orderAPI.create({ shippingAddress: address });
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      <ErrorMessage message={error} />
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-grid">
          <div className="shipping-form">
            <h2>Shipping Address</h2>
            {['street', 'city', 'state', 'zipCode', 'country', 'phone'].map((field) => (
              <label key={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <input
                  type="text"
                  required
                  value={address[field]}
                  onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            {items.map((item) => (
              <div key={item._id} className="summary-item">
                <span>{item.product?.title} x {item.quantity}</span>
                <span>{formatPrice(getEffectivePrice(item.product) * item.quantity)}</span>
              </div>
            ))}
            <p className="total">Total: <strong>{formatPrice(total)}</strong></p>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
