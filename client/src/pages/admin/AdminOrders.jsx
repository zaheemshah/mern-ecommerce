import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../api/services';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/helpers';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll().then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, field, value) => {
    try {
      const order = orders.find((o) => o._id === id);
      const payload = { orderStatus: order.orderStatus, paymentStatus: order.paymentStatus, [field]: value };
      const { data } = await orderAPI.updateStatus(id, payload);
      setOrders((prev) => prev.map((o) => (o._id === id ? data.order : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container admin-page">
      <div className="section-header">
        <h1>Order Management</h1>
        <Link to="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.user?.name}<br /><small>{order.user?.email}</small></td>
              <td>{formatPrice(order.totalAmount)}</td>
              <td>
                <select value={order.paymentStatus} onChange={(e) => updateStatus(order._id, 'paymentStatus', e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </td>
              <td>
                <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, 'orderStatus', e.target.value)}>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
