import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Changed import statement
import { toast } from 'react-toastify';

interface DecodedToken extends JwtPayload {
  userId?: string;
  [key: string]: any;
}

// Add JwtPayload interface since we removed it from jwt-decode import
interface JwtPayload {
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

  useEffect(() => {
    console.warn('AUTH STATE CHANGED:', {
      isAuthenticated,
      user,
      token: localStorage.getItem('token'),
    });
  }, [isAuthenticated, user]);

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

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token } = data;

      
      const decoded = jwtDecode<DecodedToken>(token);

      localStorage.setItem('token', token);
      document.cookie = `Authorization=Bearer ${token}; path=/; secure; samesite=strict`;

      setIsAuthenticated(true);
      setUser(decoded);
    } catch (err: any) {
      console.error('Login Error:', err);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;
  
          if (decoded.exp && currentTime >= decoded.exp) {
            console.warn("Token expired! Logging out...");
            logout();
          }
        } catch (error) {
          console.warn("Invalid token detected. Logging out...");
          logout();
        }
      }
    };
  
    
    const interval = setInterval(checkTokenExpiration, 30000);
  
    return () => clearInterval(interval);
  }, []);
  

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
      toast.warn("Time limit Expire Please Login again")
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      window.location.href = "/login"; 
    }
  };
  

  const getCsrfToken = () => {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    return metaToken || cookieToken || '';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;