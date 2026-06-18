import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../api/services';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, formatDate } from '../utils/helpers';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userAPI.getDashboard()
      .then(({ data }) => setDashboard(data.dashboard))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboard) return null;

  return (
    <div className="container dashboard-page">
      <h1>My Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{dashboard.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p>{formatPrice(dashboard.totalSpent)}</p>
        </div>
        <div className="stat-card">
          <h3>Cart Items</h3>
          <p>{dashboard.cartCount}</p>
        </div>
        <div className="stat-card">
          <h3>Wishlist</h3>
          <p>{dashboard.wishlistCount}</p>
        </div>
      </div>
      <section>
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/orders">View All</Link>
        </div>
        {dashboard.recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          dashboard.recentOrders.map((order) => (
            <div key={order._id} className="order-card">
              <span>{formatDate(order.createdAt)}</span>
              <span>{formatPrice(order.totalAmount)}</span>
              <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
            </div>
          ))
        )}
      </section>
      <div className="quick-links">
        <Link to="/cart" className="btn btn-outline">View Cart</Link>
        <Link to="/wishlist" className="btn btn-outline">View Wishlist</Link>
        <Link to="/profile" className="btn btn-outline">Edit Profile</Link>
      </div>
    </div>
  );
}

export default Dashboard;
