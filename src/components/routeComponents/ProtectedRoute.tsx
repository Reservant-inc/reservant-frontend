import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute ({ isLoggedIn } : {isLoggedIn : boolean}) {
  return (<div>{isLoggedIn ? <Outlet /> : <Navigate to='/' />}</div>);
};
