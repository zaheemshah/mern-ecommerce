import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/services';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { formatPrice, formatDate } from '../../utils/helpers';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  return (
    <div className="container admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-nav">
        <Link to="/admin/products" className="btn btn-outline">Products</Link>
        <Link to="/admin/categories" className="btn btn-outline">Categories</Link>
        <Link to="/admin/users" className="btn btn-outline">Users</Link>
        <Link to="/admin/orders" className="btn btn-outline">Orders</Link>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><h3>Users</h3><p>{stats.totalUsers}</p></div>
        <div className="stat-card"><h3>Products</h3><p>{stats.totalProducts}</p></div>
        <div className="stat-card"><h3>Orders</h3><p>{stats.totalOrders}</p></div>
        <div className="stat-card"><h3>Revenue</h3><p>{formatPrice(stats.totalRevenue)}</p></div>
        <div className="stat-card"><h3>Avg Order</h3><p>{formatPrice(stats.avgOrderValue)}</p></div>
      </div>
      <div className="admin-grid">
        <section>
          <h2>Recent Orders</h2>
          {stats.recentOrders.map((order) => (
            <div key={order._id} className="admin-row">
              <span>{order.user?.name}</span>
              <span>{formatPrice(order.totalAmount)}</span>
              <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          ))}
        </section>
        <section>
          <h2>Recent Customers</h2>
          {stats.customers.map((customer) => (
            <div key={customer._id} className="admin-row">
              <span>{customer.name}</span>
              <span>{customer.email}</span>
              <span>{formatDate(customer.createdAt)}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
