// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../service/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const role = parsedUser.role ? parsedUser.role.toLowerCase() : 'user';
        setUserRole(role);
        setIsAuthenticated(true);
        console.log('✅ User restored:', parsedUser.name, 'Role:', role);
      } catch (error) {
        console.error('Error restoring user:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials.email, credentials.password);
      
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      const userData = response.user_data || response.teacher_data || {};
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);
      
      const role = userData.role ? userData.role.toLowerCase() : 'user';
      localStorage.setItem('role', role);
      
      setUser(userData);
      setUserRole(role);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful:', userData.name, 'Role:', role);
      toast.success(`Welcome ${userData.name || 'User'}!`);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      userRole, 
      loading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};