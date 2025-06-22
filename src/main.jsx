import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import { AuthProvider } from './context/authContext';
import './App.css';
import './index.css';
import Login from './Pages/Login/Login';
import SideBarController from './components/sideBar/SideBarController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';
import PermissionBasedRoute from './components/permission/PermissionBasedRoute'; 
import Loader from './components/loader/loader';


const App = () => {
  const { isAuthenticated , isLoading} = useAuth();
  if (isLoading) {
    return <div><Loader/></div>; 
  }

  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

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
          <Route path="*" element={<Navigate to="/login" />} />
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