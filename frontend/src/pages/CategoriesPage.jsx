import { useEffect, useState } from 'react';
import api from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories || [])).catch(console.error);
  }, []);

  return (
    <div className="container page-shell">
      <h2 className="section-title">Browse Categories</h2>
      <div className="row g-4">
        {categories.map((category) => (
          <div key={category._id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm card-hover p-4">
              <h4>{category.name}</h4>
              <p className="text-secondary mb-3">{category.description}</p>
              <button className="btn btn-primary">View Products</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
