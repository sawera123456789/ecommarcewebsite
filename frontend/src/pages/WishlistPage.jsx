import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const WishlistPage = () => {
  const { user, setCart } = useApp();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.wishlist || { products: [] });
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlist(res.data.wishlist || { products: [] });
    } catch (error) {
      console.error('Failed to remove wishlist item:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await api.post('/cart', { productId, quantity: 1 });
      setCart(res.data.cart || { items: [] });
    } catch (error) {
      console.error('Failed to add wishlist item to cart:', error);
    }
  };

  if (!user) {
    return (
      <div className="container page-shell">
        <h2 className="section-title">Wishlist</h2>
        <div className="alert alert-warning">Please login to manage your wishlist.</div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <h2 className="section-title">Wishlist</h2>

      {loading ? (
        <div className="text-center py-5">Loading wishlist...</div>
      ) : wishlist.products.length === 0 ? (
        <div className="alert alert-info">No saved items yet. <Link to="/shop">Browse products</Link></div>
      ) : (
        <div className="row g-4">
          {wishlist.products.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4">
              <div className="product-card h-100">
                <img src={product.images?.[0] || 'https://images.unsplash.com/...'} alt={product.name} />
                <div className="p-3">
                  <h5>{product.name}</h5>
                  <p className="text-secondary small">{product.brand}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong>${product.discountPrice || product.price}</strong>
                    <span className="text-warning">★ {product.rating || 0}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Link className="btn btn-outline-primary btn-sm flex-grow-1" to={`/product/${product._id}`}>View</Link>
                    <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => addToCart(product._id)}>Move to Cart</button>
                  </div>
                  <button className="btn btn-link text-danger p-0 mt-2" onClick={() => removeItem(product._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
