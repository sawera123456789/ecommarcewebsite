import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user, setCart } = useApp();

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await api.post('/cart', { productId: product._id, quantity });
      setCart(res.data.cart || { items: [] });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="container py-5 text-center">Loading product...</div>;
  if (!product) return <div className="container py-5 text-center">Product not found.</div>;

  return (
    <div className="container page-shell">
      <div className="row g-5 align-items-start">
        <div className="col-lg-6">
          <div className="product-detail-image">
            <img src={product.images?.[0] || 'https://images.unsplash.com/...'} alt={product.name} className="img-fluid w-100" />
          </div>
        </div>
        <div className="col-lg-6">
          <span className="badge bg-light text-dark">{product.brand}</span>
          <h1 className="mt-3">{product.name}</h1>
          <div className="mb-3 text-warning">★ {product.rating || 0}</div>
          <div className="d-flex align-items-center gap-3 mb-3">
            <h3 className="mb-0">${product.discountPrice || product.price}</h3>
            {product.discountPrice && <span className="text-decoration-line-through text-muted">${product.price}</span>}
          </div>
          <p className="text-secondary">{product.description}</p>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="input-group" style={{ maxWidth: 140 }}>
              <button className="btn btn-outline-secondary" onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">-</button>
              <input className="form-control text-center" value={quantity} readOnly />
              <button className="btn btn-outline-secondary" onClick={() => setQuantity((value) => value + 1)} type="button">+</button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn btn-outline-primary btn-lg">Add to Wishlist</button>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item px-0">SKU: {product.sku}</li>
            <li className="list-group-item px-0">Stock: {product.stock}</li>
            <li className="list-group-item px-0">Category: {product.category?.name}</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h3>Related Products</h3>
        <div className="row g-4 mt-2">
          {product.relatedProducts?.map((item) => (
            <div key={item._id} className="col-md-3">
              <div className="product-card h-100">
                <img src={item.images?.[0] || 'https://images.unsplash.com/...'} alt={item.name} />
                <div className="p-3">
                  <h5>{item.name}</h5>
                  <Link to={`/product/${item._id}`} className="btn btn-outline-primary btn-sm">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
