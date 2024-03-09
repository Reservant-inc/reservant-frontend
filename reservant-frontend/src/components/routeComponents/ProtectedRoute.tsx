import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn } : {isLoggedIn : boolean}) => {
  return <div>{isLoggedIn ? <Outlet /> : <Navigate to='/' />}</div>;
};

export default ProtectedRoute;