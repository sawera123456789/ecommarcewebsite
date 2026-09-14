import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const CartPage = () => {
  const { user, setCart } = useApp();
  const [cart, setLocalCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/cart');
      const cartData = res.data.cart || { items: [] };
      setLocalCart(cartData);
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      const cartData = res.data.cart || { items: [] };
      setLocalCart(cartData);
      setCart(cartData);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      const cartData = res.data.cart || { items: [] };
      setLocalCart(cartData);
      setCart(cartData);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const clearCart = async () => {
    try {
      for (const item of cart.items) {
        await api.delete(`/cart/${item._id}`);
      }
      setLocalCart({ items: [] });
      setCart({ items: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const shippingFee = subtotal > 500 ? 0 : 25;
  const grandTotal = subtotal + shippingFee;

  if (!user) {
    return (
      <div className="container page-shell">
        <h2 className="section-title">Your Cart</h2>
        <div className="alert alert-warning">Please login to view and manage your cart.</div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <h2 className="section-title">Your Cart</h2>

      {loading ? (
        <div className="text-center py-5">Loading cart...</div>
      ) : cart.items.length === 0 ? (
        <div className="alert alert-info">Your cart is empty. <Link to="/shop">Continue shopping</Link></div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {cart.items.map((item) => (
              <div key={item._id} className="card mb-3 border-0 shadow-sm">
                <div className="row g-0 align-items-center p-3">
                  <div className="col-md-3">
                    <img src={item.product?.images?.[0] || 'https://images.unsplash.com/...'} alt={item.product?.name} className="img-fluid rounded" />
                  </div>
                  <div className="col-md-6 p-3">
                    <h5>{item.product?.name}</h5>
                    <p className="text-secondary mb-2">{item.product?.brand}</p>
                    <strong>${item.product?.discountPrice || item.product?.price}</strong>
                  </div>
                  <div className="col-md-3 text-end">
                    <div className="input-group mb-2">
                      <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                      <input className="form-control text-center" value={item.quantity} readOnly />
                      <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="btn btn-link text-danger p-0" onClick={() => removeItem(item._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="form-card">
              <h4>Order Summary</h4>
              <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Shipping</span><span>${shippingFee.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Discount</span><span>$0.00</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold"><span>Grand Total</span><span>${grandTotal.toFixed(2)}</span></div>
              <Link className="btn btn-primary w-100 mt-3" to="/checkout">Proceed to Checkout</Link>
              <button className="btn btn-outline-secondary w-100 mt-2" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
