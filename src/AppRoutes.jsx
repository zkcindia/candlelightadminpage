import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import AgentSignUp from './pages/AgentSignUp';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/agent-signup" element={<AgentSignUp />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Add more routes here */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;