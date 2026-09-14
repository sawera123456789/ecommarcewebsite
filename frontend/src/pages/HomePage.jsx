import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setCart } = useApp();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  const handleAddToCart = async (productId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await api.post('/cart', { productId, quantity: 1 });
      setCart(res.data.cart || { items: [] });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const ProductCard = ({ product }) => (
    <div className="col-md-6 col-lg-3">
      <div className="product-card h-100">
        <img src={product.images?.[0] || 'https://images.unsplash.com/...'} alt={product.name} />
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-light text-dark">{product.brand}</span>
            <span className="text-warning">★ {product.rating || 0}</span>
          </div>
          <h5 className="mb-2">{product.name}</h5>
          <div className="d-flex align-items-center mb-3">
            <strong className="me-2">${product.discountPrice || product.price}</strong>
            {product.discountPrice && <small className="text-decoration-line-through text-muted">${product.price}</small>}
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary btn-sm flex-grow-1" to={`/product/${product._id}`}>View</Link>
            <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <section className="hero container py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <span className="badge bg-primary-subtle text-primary mb-3">New season arrivals</span>
            <h1 className="display-4 fw-bold">Elevate your everyday essentials.</h1>
            <p className="lead text-secondary">Discover premium fashion, electronics, and home picks curated for modern living.</p>
            <div className="d-flex gap-3">
              <Link className="btn btn-primary btn-lg" to="/shop">Shop Now</Link>
              <Link className="btn btn-outline-primary btn-lg" to="/categories">Explore Categories</Link>
            </div>
            <div className="row mt-4 text-center text-lg-start">
              <div className="col-sm-4"><h4 className="fw-bold">20k+</h4><small className="text-secondary">Happy shoppers</small></div>
              <div className="col-sm-4"><h4 className="fw-bold">150+</h4><small className="text-secondary">Curated products</small></div>
              <div className="col-sm-4"><h4 className="fw-bold">4.9/5</h4><small className="text-secondary">Average rating</small></div>
            </div>
          </div>
          <div className="col-lg-6">
            <img className="img-fluid rounded-4 shadow-lg" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80" alt="Hero" />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Featured Products</h2>
          <Link className="btn btn-link text-primary text-decoration-none" to="/shop">View all</Link>
        </div>
        <div className="row g-4">
          {loading ? <div className="col-12 text-center py-5">Loading...</div> : featured.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="container py-5">
        <div className="bg-primary text-white rounded-4 p-4 p-lg-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2">Flash Sale</h2>
              <p className="mb-0">Get up to 50% off selected premium items this week only.</p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link className="btn btn-light btn-lg" to="/shop">Shop Offers</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">New Arrivals</h2>
        </div>
        <div className="row g-4">
          {newArrivals.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Best Selling</h2>
        </div>
        <div className="row g-4">
          {bestSellers.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover p-4">
              <div className="feature-icon mb-3"><i className="bi bi-truck" /></div>
              <h5>Fast Shipping</h5>
              <p className="text-secondary mb-0">Quick and reliable delivery across major cities.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover p-4">
              <div className="feature-icon mb-3"><i className="bi bi-shield-check" /></div>
              <h5>Secure Checkout</h5>
              <p className="text-secondary mb-0">Safe payment options and protected transactions.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover p-4">
              <div className="feature-icon mb-3"><i className="bi bi-headset" /></div>
              <h5>24/7 Support</h5>
              <p className="text-secondary mb-0">Dedicated team ready to help anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
