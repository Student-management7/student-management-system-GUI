import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

// Define interfaces
interface DecodedToken {
  userId?: string;
  exp?: number;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to check token validity
  const checkTokenValidity = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : false;
    } catch {
      return false;
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await fetch('https://s-m-s-keyw.onrender.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-Token': getCsrfToken(),
        },
      }).catch(err => console.warn('Logout API call failed:', err));
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      navigate('/login'); // Redirect to login after logout
    }
  };

  // Function to get CSRF token
  const getCsrfToken = () => {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    return metaToken || cookieToken || '';
  };

  // Handle login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://s-m-s-keyw.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      const { token } = data;
      localStorage.setItem('token', token);
      document.cookie = `Authorization=Bearer ${token}; path=/; secure; samesite=strict`;

      setIsAuthenticated(true);
      setUser(jwtDecode<DecodedToken>(token));
    } catch (err: any) {
      console.error('Login Error:', err);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to check token on initial load
  useEffect(() => {
    const checkInitialToken = () => {
      const token = localStorage.getItem('token');
      if (token && checkTokenValidity(token)) {
        setIsAuthenticated(true);
        setUser(jwtDecode<DecodedToken>(token));
      } else {
        logout();
      }
      setIsLoading(false);
    };
    
    checkInitialToken();

    // **🔄 Auto Logout on Token Expiry**  
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && !checkTokenValidity(token)) {
        logout();
      }
    }, 60000); // Check token expiry every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {!isLoading && children} {/* Prevent flickering while loading */}
    </AuthContext.Provider>
  );
};

// Custom Hook for Authentication
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;
