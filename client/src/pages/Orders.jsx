import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../api/services';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, formatDate } from '../utils/helpers';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (currentPage = 1) => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getMy({ page: currentPage });
      setOrders(data.orders);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchOrders(page)} />;

  return (
    <div className="container">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet. <Link to="/products">Start shopping</Link></p>
      ) : (
        <>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span>#{order._id.slice(-8).toUpperCase()}</span>
                  <span>{formatDate(order.createdAt)}</span>
                  <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
                </div>
                <p>{order.orderItems.length} item(s) — {formatPrice(order.totalAmount)}</p>
                <Link to={`/order-confirmation/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
              </div>
            ))}
          </div>
          <Pagination page={page} pages={pages} onPageChange={fetchOrders} />
        </>
      )}
    </div>
  );
}

export default Orders;
