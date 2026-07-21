import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('super_admin');

  useEffect(() => {
    // ✅ Mock user data with role
    const mockUser = {
      id: 1,
      name: 'Super Admin',
      email: 'admin@candlelight.com',
      role: 'super_admin', // super_admin, admin, agent
      district: null, // Only for agents
      school: null, // Only for agents
      avatar: null,
    };
    setUser(mockUser);
    setUserRole(mockUser.role);
    setIsAuthenticated(true);
  }, []);

  const login = async (credentials) => {
    // ✅ Mock login with role
    const mockUsers = {
      'admin@candlelight.com': {
        id: 1,
        name: 'Super Admin',
        email: 'admin@candlelight.com',
        role: 'super_admin',
        district: null,
      },
      'admin@school.com': {
        id: 2,
        name: 'School Admin',
        email: 'admin@school.com',
        role: 'admin',
        district: 'Mumbai',
        school: 'St. Mary\'s School',
      },
      'agent@candlelight.com': {
        id: 3,
        name: 'Agent Suresh',
        email: 'agent@candlelight.com',
        role: 'agent',
        district: 'Mumbai',
        school: null,
      },
    };

    const user = mockUsers[credentials.email];
    if (user) {
      setUser(user);
      setUserRole(user.role);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(user));
      toast.success(`Welcome ${user.name}!`);
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};