import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setCart } = useApp();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    sort: '',
    page: 1,
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products', { params: filters }),
          api.get('/categories'),
        ]);
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className="container page-shell">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="form-card">
            <h4>Filters</h4>
            <div className="mb-3">
              <label className="form-label">Search</label>
              <input className="form-control" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sort</label>
              <select className="form-select" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                <option value="">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Shop Products</h2>
            <small className="text-secondary">{products.length} items</small>
          </div>

          {loading ? (
            <div className="text-center py-5">Loading products...</div>
          ) : (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product._id} className="col-md-6 col-xl-4">
                  <div className="product-card h-100">
                    <img src={product.images?.[0] || 'https://images.unsplash.com/...'} alt={product.name} />
                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-light text-dark">{product.brand}</span>
                        <span className="text-warning">★ {product.rating || 0}</span>
                      </div>
                      <h5>{product.name}</h5>
                      <div className="d-flex gap-2 align-items-center mb-3">
                        <strong>${product.discountPrice || product.price}</strong>
                        {product.discountPrice && <small className="text-decoration-line-through text-muted">${product.price}</small>}
                      </div>
                      <div className="d-flex gap-2">
                        <Link className="btn btn-outline-primary btn-sm flex-grow-1" to={`/product/${product._id}`}>View</Link>
                        <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
