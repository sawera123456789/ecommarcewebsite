import { Outlet, Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MainLayout = () => {
  const { user, cart, wishlist, logout } = useApp();

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist.products?.length || 0;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Luxora<span className="text-primary">Shop</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/shop">Shop</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/categories">Categories</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
            </ul>
            <form className="d-flex mx-lg-3 flex-grow-1 justify-content-center" action="/search">
              <input className="form-control" type="search" name="q" placeholder="Search products..." aria-label="Search" />
            </form>
            <div className="d-flex align-items-center gap-3">
              <Link className="nav-link position-relative" to="/wishlist">
                <i className="bi bi-heart fs-4" />
                {wishlistCount > 0 && <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">{wishlistCount}</span>}
              </Link>
              <Link className="nav-link position-relative" to="/cart">
                <i className="bi bi-cart fs-4" />
                {cartCount > 0 && <span className="badge bg-primary rounded-pill position-absolute top-0 start-100 translate-middle">{cartCount}</span>}
              </Link>
              {user ? (
                <div className="dropdown">
                  <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">{user.name}</button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                    {user.role === 'admin' && <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link className="btn btn-outline-primary" to="/login">Login</Link>
                  <Link className="btn btn-primary" to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-dark text-light mt-5">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-3">
              <h5>LuxoraShop</h5>
              <p className="text-secondary">Premium products for modern lifestyles.</p>
            </div>
            <div className="col-md-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link className="text-secondary text-decoration-none" to="/shop">Shop</Link></li>
                <li><Link className="text-secondary text-decoration-none" to="/about">About</Link></li>
                <li><Link className="text-secondary text-decoration-none" to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Support</h6>
              <ul className="list-unstyled">
                <li><Link className="text-secondary text-decoration-none" to="/faq">FAQ</Link></li>
                <li><Link className="text-secondary text-decoration-none" to="/privacy">Privacy</Link></li>
                <li><Link className="text-secondary text-decoration-none" to="/terms">Terms</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Newsletter</h6>
              <div className="input-group">
                <input className="form-control" placeholder="Your email" />
                <button className="btn btn-primary">Join</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
