import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './school/context/authContext';
import { AuthProvider } from './school/context/authContext';
import './App.css';
import './index.css';
import Login from './school/Pages/Login/Login';
import SideBarController from './school/components/sideBar/SideBarController';
import HeaderController from './school/components/main/HeaderController';
import FooterController from './school/components/main/FooterController';
import PermissionBasedRoute from './school/components/permission/PermissionBasedRoute'; 
import Loader from './school/components/loader/loader';
import Selection from './Selection';
import Register from './hotel/auth/Register';
import LoginHotel from './hotel/auth/LoginHotel';
import Home from './hotel/Home';
import AddCustomer from './hotel/hoteluser/AddCustomer';

const App = () => {
  const { isAuthenticated , isLoading} = useAuth();
  if (isLoading) {
    return <div><Loader/></div>; 
  }

  return (
    <>
      <Routes>

        <Route path="/" element={<Selection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-hotel" element={<LoginHotel />} />
        <Route path="/hotel-customer" element={<AddCustomer />} />
        <Route path="/hotel-home" element={<Home />} />


        {/* Protected routes for authenticated users */}
        {isAuthenticated ? (
          <Route path="*" element={
            <div className="mainBody">
              <SideBarController />
              <div className="rhsBox">
                <HeaderController />
                <PermissionBasedRoute />
                <FooterController />
              </div>
            </div>
          } />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </>
  );
}; 

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </Router>
);