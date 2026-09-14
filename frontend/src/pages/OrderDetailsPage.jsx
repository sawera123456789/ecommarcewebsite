import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (error) {
        console.error('Failed to load order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="container page-shell text-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="container page-shell"><div className="alert alert-warning">Order not found.</div></div>;
  }

  return (
    <div className="container page-shell">
      <h2 className="section-title">Order Details</h2>
      <div className="form-card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h4 className="mb-1">{order.orderId}</h4>
            <small className="text-secondary">Placed on {new Date(order.createdAt).toLocaleDateString()}</small>
          </div>
          <span className="badge bg-primary">{order.orderStatus}</span>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <h5>Shipping Address</h5>
            <p className="mb-1">{order.shippingAddress.fullName}</p>
            <p className="mb-1">{order.shippingAddress.address}</p>
            <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="mb-1">{order.shippingAddress.country} {order.shippingAddress.postalCode}</p>
            <p className="mb-0">{order.shippingAddress.phone}</p>
          </div>
          <div className="col-md-6">
            <h5>Payment</h5>
            <p className="mb-1">Method: {order.paymentMethod}</p>
            <p className="mb-1">Status: {order.paymentStatus}</p>
            <p className="mb-0">Total: ${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.product}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link className="btn btn-primary mt-3" to="/orders">Back to Orders</Link>
    </div>
  );
};

export default OrderDetailsPage;
