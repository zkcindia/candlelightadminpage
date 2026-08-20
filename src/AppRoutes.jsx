// src/AppRoutes.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// ✅ Import all pages
import MainPage from "./pages/student/MainPage";
import Teachers from './pages/teacher/Teachers';
import Agents from './pages/Agents';
import Transactions from './pages/Transactions';
import Settings from './pages/setting';
import Approvals from './pages/Approvals';
import MainReminder from './pages/ReminderDays/MainReminder';

// ✅ Import Class Management Pages (3 Separate Pages)
import Boards from './pages/classmanagment/Boards';
import Classes from './pages/classmanagment/Classes';
import Subjects from './pages/classmanagment/Subjects';

function AppRoutes() {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  console.log('🔍 AppRoutes - isAuthenticated:', isAuthenticated);
  console.log('🔍 AppRoutes - userRole:', userRole);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        
        {/* Dashboard - All roles can access */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Admin & Super Admin Routes */}
        <Route 
          path="students" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <MainPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="teachers" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Teachers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="transactions" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Transactions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="reminder-days" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <MainReminder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="approvals" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Approvals />
            </ProtectedRoute>
          } 
        />
        
        {/* ✅ New Routes - 3 Separate Pages for Hierarchy */}
        <Route 
          path="boards" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Boards />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="classes" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Classes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="subjects" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Subjects />
            </ProtectedRoute>
          } 
        />
        
        {/* Super Admin Only Routes */}
        <Route 
          path="agents" 
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Agents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;