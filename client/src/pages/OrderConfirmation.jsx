import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../api/services';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice, formatDate } from '../utils/helpers';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id).then(({ data }) => {
      setOrder(data.order);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!order) return null;

  return (
    <div className="container order-confirmation">
      <div className="success-banner">
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
      </div>
      <div className="order-details-card">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Total:</strong> {formatPrice(order.totalAmount)}</p>
        <h3>Items</h3>
        <ul>
          {order.orderItems.map((item, idx) => (
            <li key={idx}>{item.title} x {item.quantity} — {formatPrice(item.price * item.quantity)}</li>
          ))}
        </ul>
        <div className="actions">
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
          <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
