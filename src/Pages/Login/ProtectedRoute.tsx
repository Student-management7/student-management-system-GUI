import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext'; // Assuming auth context is set up

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get the auth state

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
