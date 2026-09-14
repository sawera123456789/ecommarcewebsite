import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', { params: { search: query } });
        setProducts(res.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container page-shell">
      <h2 className="section-title">Search Results</h2>
      <p className="text-secondary">Showing results for: <strong>{query}</strong></p>

      {loading ? (
        <div className="text-center py-5">Loading search results...</div>
      ) : products.length === 0 ? (
        <div className="alert alert-warning">No products matched your search.</div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4">
              <div className="product-card h-100">
                <img src={product.images?.[0] || 'https://images.unsplash.com/...'} alt={product.name} />
                <div className="p-3">
                  <h5>{product.name}</h5>
                  <p className="text-secondary small">{product.brand}</p>
                  <div className="d-flex justify-content-between mb-3">
                    <strong>${product.discountPrice || product.price}</strong>
                    <span className="text-warning">★ {product.rating || 0}</span>
                  </div>
                  <Link className="btn btn-primary w-100" to={`/product/${product._id}`}>View Product</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
