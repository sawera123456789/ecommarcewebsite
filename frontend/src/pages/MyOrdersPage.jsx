import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const MyOrdersPage = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container page-shell">
        <h2 className="section-title">My Orders</h2>
        <div className="alert alert-warning">Please login to view your orders.</div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <h2 className="section-title">My Orders</h2>

      {loading ? (
        <div className="text-center py-5">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">No orders yet. <Link to="/shop">Start shopping</Link></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td><span className="badge bg-primary">{order.orderStatus}</span></td>
                  <td>${order.total.toFixed(2)}</td>
                  <td><Link to={`/orders/${order._id}`} className="btn btn-outline-primary btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
