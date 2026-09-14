import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, setCart } = useApp();
  const [cart, setLocalCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/cart');
        setLocalCart(res.data.cart || { items: [] });
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const shippingFee = subtotal > 500 ? 0 : 25;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'Cash on Delivery',
      });

      setOrderPlaced(res.data.order);
      setCart({ items: [] });
      setLocalCart({ items: [] });
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.response?.data?.message || 'Checkout failed');
    }
  };

  if (!user) {
    return (
      <div className="container page-shell">
        <h2 className="section-title">Checkout</h2>
        <div className="alert alert-warning">Please login to place an order.</div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <h2 className="section-title">Checkout</h2>

      {loading ? (
        <div className="text-center py-5">Loading checkout...</div>
      ) : cart.items.length === 0 ? (
        <div className="alert alert-info">Your cart is empty. <Link to="/shop">Continue shopping</Link></div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <form className="form-card" onSubmit={handleSubmit}>
              <h4 className="mb-3">Shipping Details</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <input className="form-control" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <input className="form-control" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <input className="form-control" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Postal Code</label>
                  <input className="form-control" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
                </div>
              </div>

              <div className="mt-4">
                <h4>Payment Method</h4>
                <div className="form-check mt-2">
                  <input className="form-check-input" type="radio" name="payment" checked readOnly />
                  <label className="form-check-label">Cash on Delivery</label>
                </div>
              </div>

              <button className="btn btn-primary mt-4 w-100" type="submit">Place Order</button>
            </form>
          </div>

          <div className="col-lg-5">
            <div className="form-card">
              <h4>Order Summary</h4>
              {cart.items.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span>${((item.product?.discountPrice || item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between"><span>Shipping</span><span>${shippingFee.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between"><span>Discount</span><span>$0.00</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
