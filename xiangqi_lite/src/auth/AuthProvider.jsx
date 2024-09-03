import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < new Date().getTime();
      if (!isExpired) {
        setIsAuthenticated(true);
        autoLogout(token);
      } else {
        logout();
      }
    }
    setLoading(false); // Set loading to false after check
  };

  const login = (token) => {
    setIsAuthenticated(true);
    autoLogout(token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  const autoLogout = (token) => {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000 - new Date().getTime();
    setTimeout(() => {
      logout();
      alert('Session has expired. Please login again.');
    }, expirationTime);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
