import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute State:', { isAuthenticated, isLoading });
  
  
  console.log({ isAuthenticated, isLoading });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.warn('Redirecting to login because user is not authenticated.');
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};


export default ProtectedRoute;
