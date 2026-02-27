import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserDashboard from '../pages/UserDashboard';
import CompanyDashboard from '../pages/CompanyDashboard';
import AdminDashboard from '../pages/AdminDashboard';

const DashboardRoot = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  
  // Route to the appropriate dashboard type based on role
  if (user.role === 'company') {
    return <CompanyDashboard />;
  }
  
  return <UserDashboard />;
};

export default DashboardRoot;
