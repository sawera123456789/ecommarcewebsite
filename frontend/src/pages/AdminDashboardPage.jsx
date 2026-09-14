import { useEffect, useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const emptyCategoryForm = {
  name: '',
  description: '',
  image: '',
};

const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  brand: '',
  stock: '',
  sku: '',
  images: '',
  featured: false,
  newArrival: false,
  bestSeller: false,
  status: 'active',
};

const AdminDashboardPage = () => {
  const { user } = useApp();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryMessage, setCategoryMessage] = useState('');
  const [productMessage, setProductMessage] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || user.role !== 'admin') {
        setLoading(false);
        return;
      }

      try {
        const [statsRes, usersRes, productsRes, categoriesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users'),
          api.get('/products?limit=100'),
          api.get('/categories'),
        ]);

        setStats(statsRes.data.stats || null);
        setUsers(usersRes.data.users || []);
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleRoleChange = async (userId, nextRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: nextRole });
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === userId ? res.data.user : item
        )
      );
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((currentUsers) => currentUsers.filter((item) => item._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((current) => ({ ...current, [name]: value }));
  };

  const handleProductChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setCategoryMessage('');

    try {
      const res = await api.post('/categories', categoryForm);
      setCategories((current) => [res.data.category, ...current]);
      setCategoryForm(emptyCategoryForm);
      setCategoryMessage('Category created successfully.');
    } catch (error) {
      console.error('Failed to create category:', error);
      setCategoryMessage(error.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories((current) => current.filter((category) => category._id !== categoryId));
      setProducts((current) => current.filter((product) => product.category !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setProductMessage('');

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: Number(productForm.discountPrice || 0),
        stock: Number(productForm.stock),
        images: productForm.images
          .split(',')
          .map((image) => image.trim())
          .filter(Boolean),
      };

      const res = await api.post('/products', payload);
      setProducts((current) => [res.data.product, ...current]);
      setProductForm(emptyProductForm);
      setProductMessage('Product created successfully.');
    } catch (error) {
      console.error('Failed to create product:', error);
      setProductMessage(error.response?.data?.message || 'Failed to create product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts((current) => current.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (!user) {
    return (
      <div className="container page-shell">
        <h2 className="section-title">Admin Dashboard</h2>
        <div className="alert alert-warning">Please login to access the admin dashboard.</div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="container page-shell">
        <h2 className="section-title">Admin Dashboard</h2>
        <div className="alert alert-danger">Access denied. Admin privileges are required.</div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <h2 className="section-title">Admin Dashboard</h2>

      {loading ? (
        <div className="text-center py-5">Loading dashboard...</div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Total Users</div>
                  <h3 className="fw-bold mt-2 mb-0">{stats?.totalUsers ?? 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Products</div>
                  <h3 className="fw-bold mt-2 mb-0">{stats?.totalProducts ?? 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Orders</div>
                  <h3 className="fw-bold mt-2 mb-0">{stats?.totalOrders ?? 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Revenue</div>
                  <h3 className="fw-bold mt-2 mb-0">${(stats?.totalRevenue ?? 0).toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Order Status</h4>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Pending</span>
                    <strong>{stats?.pendingOrders ?? 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Delivered</span>
                    <strong>{stats?.deliveredOrders ?? 0}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Users</h4>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((item) => (
                          <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={item.role}
                                onChange={(event) => handleRoleChange(item._id, event.target.value)}
                              >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteUser(item._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Create Category</h4>
                  <form onSubmit={handleCreateCategory}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={categoryForm.name}
                        onChange={handleCategoryChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={categoryForm.description}
                        onChange={handleCategoryChange}
                        rows="3"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        className="form-control"
                        name="image"
                        value={categoryForm.image}
                        onChange={handleCategoryChange}
                      />
                    </div>
                    <button className="btn btn-primary" type="submit">Add Category</button>
                  </form>
                  {categoryMessage && <div className="alert alert-info mt-3 mb-0">{categoryMessage}</div>}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Categories</h4>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Slug</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.slug}</td>
                            <td>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteCategory(category._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Create Product</h4>
                  <form onSubmit={handleCreateProduct}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        className="form-control"
                        name="brand"
                        value={productForm.brand}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label className="form-label">Price</label>
                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          step="0.01"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Discount Price</label>
                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          step="0.01"
                          name="discountPrice"
                          value={productForm.discountPrice}
                          onChange={handleProductChange}
                        />
                      </div>
                    </div>
                    <div className="row g-2 mt-0">
                      <div className="col-md-6">
                        <label className="form-label">Stock</label>
                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          name="stock"
                          value={productForm.stock}
                          onChange={handleProductChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">SKU</label>
                        <input
                          className="form-control"
                          name="sku"
                          value={productForm.sku}
                          onChange={handleProductChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Images (comma-separated URLs)</label>
                      <input
                        className="form-control"
                        name="images"
                        value={productForm.images}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={productForm.description}
                        onChange={handleProductChange}
                        rows="3"
                        required
                      />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="featured"
                            checked={productForm.featured}
                            onChange={handleProductChange}
                          />
                          <label className="form-check-label">Featured</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="newArrival"
                            checked={productForm.newArrival}
                            onChange={handleProductChange}
                          />
                          <label className="form-check-label">New Arrival</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="bestSeller"
                            checked={productForm.bestSeller}
                            onChange={handleProductChange}
                          />
                          <label className="form-check-label">Best Seller</label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={productForm.status}
                        onChange={handleProductChange}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <button className="btn btn-primary" type="submit">Add Product</button>
                  </form>
                  {productMessage && <div className="alert alert-info mt-3 mb-0">{productMessage}</div>}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Products</h4>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{categories.find((category) => category._id === product.category)?.name || 'Unknown'}</td>
                            <td>${(product.discountPrice || product.price || 0).toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
