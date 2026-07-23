import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import Login from './components/auth/Login';
import AgentSignup from './pages/AgentSignUp';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import MainPage from "./pages/student/MainPage"
import Teachers from './pages/teacher/Teachers';
import Agents from './pages/Agents';
import Transactions from './pages/Transactions';
import Settings from './pages/setting';

// Role Based Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AgentDashboard from './pages/agent/AgentDashboard';

// Import roles
import { ROLES } from './config/roles';

function AppRoutes() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/agent-signup" element={<AgentSignup />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        
        {/* Dashboard - Role Based */}
        <Route 
          path="dashboard" 
          element={
            userRole === ROLES.SUPER_ADMIN ? <Dashboard /> :
            userRole === ROLES.ADMIN ? <AdminDashboard /> :
            userRole === ROLES.AGENT ? <AgentDashboard /> :
            <Dashboard />
          } 
        />
        
        {/* Super Admin & Admin Routes */}
        <Route 
          path="students" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <MainPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="teachers" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Teachers />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="transactions" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Transactions />
            </ProtectedRoute>
          } 
        />
        
        {/* Super Admin Only Routes */}
        <Route 
          path="agents" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <Agents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <Settings />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="logs" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <Logs />
            </ProtectedRoute>
          } 
        /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;