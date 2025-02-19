import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/authContext';
import { AuthProvider } from './context/authContext';
import './App.css';
import './index.css';
import Login from './Pages/Login/Login';
import SideBarController from './components/sideBar/SideBarController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';
import PermissionBasedRoute from './components/permission/PermissionBasedRoute'; 

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className="mainBody">
          <SideBarController />
          <div className="rhsBox">
            <HeaderController />
            <PermissionBasedRoute />
            <FooterController />
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

// Rendering App
createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);