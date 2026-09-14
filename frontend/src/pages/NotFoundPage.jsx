import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container page-shell text-center">
    <h1 className="display-1 fw-bold text-gradient">404</h1>
    <h2>Page not found</h2>
    <p className="text-secondary">The page you are looking for does not exist.</p>
    <Link className="btn btn-primary" to="/">Go home</Link>
  </div>
);

export default NotFoundPage;
