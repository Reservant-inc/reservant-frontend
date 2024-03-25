import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute ({ isLoggedIn } : {isLoggedIn : boolean}) {
  const location = useLocation();

  if (isLoggedIn && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/login')) {
    return <Navigate to="/reservant" />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};
