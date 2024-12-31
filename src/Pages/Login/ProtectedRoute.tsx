import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';


const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute State:', { isAuthenticated, isLoading });
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.log('Not Authenticated - Redirecting to Login');
    return <Navigate to="/Login" replace />;
  }
  
  // Use Outlet to render nested routes
  return <Outlet />;
};

export default ProtectedRoute;


