import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // ✅ TRUE kar diya

  useEffect(() => {
    // ✅ Hardcode user data - Dashboard direct dikhega
    setUser({
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'super_admin',
      avatar: null,
    });
    setIsAuthenticated(true);
  }, []);

  const login = async (credentials) => {
    // ✅ Always return true - Login bypass
    setUser({
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'super_admin',
    });
    setIsAuthenticated(true);
    toast.success('Login successful!');
    return true;
  };

  const logout = async () => {
    try {
      // Optional: Call logout API
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};