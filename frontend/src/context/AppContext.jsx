import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      api.get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      api.get('/cart').then((res) => setCart(res.data.cart || { items: [] })).catch(() => setCart({ items: [] }));
      api.get('/wishlist').then((res) => setWishlist(res.data.wishlist || { products: [] })).catch(() => setWishlist({ products: [] }));
    }
  }, [token]);

  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setCart({ items: [] });
    setWishlist({ products: [] });
  };

  return (
    <AppContext.Provider value={{ user, token, cart, setCart, wishlist, setWishlist, loading, setLoading, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
