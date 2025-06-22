import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp?: number;
  userId?: string;
  [key: string]: any;
}

interface UserDetails {
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  userDetails: UserDetails | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserDetails: (details: UserDetails | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkInitialToken =() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && currentTime < decoded.exp) {
            setIsAuthenticated(true);
            setUser(decoded);

            const storedUserDetails = localStorage.getItem('userDetails');
            if (storedUserDetails) {
              setUserDetails(JSON.parse(storedUserDetails));
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error('Token decode error:', error);
           logout();
        }
      } else {
         logout();
      }
      setIsLoading(false); 
    };

    checkInitialToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    
    try {
      const response = await fetch('https://s-m-s-keyw.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token } = data;
      const decoded = jwtDecode<DecodedToken>(token);

      localStorage.setItem('token', token);
      localStorage.setItem('userDetails',JSON.stringify(decoded));

      setIsAuthenticated(true);
      setUser(decoded);
      setUserDetails(decoded);
    } catch (err: any) {
      console.error('Login Error:', err);
      setIsAuthenticated(false);
      setUser(null);
      setUserDetails(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('https://s-m-s-keyw.onrender.com/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).catch((err) => console.warn('Logout API call failed:', err));
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      setIsAuthenticated(false);
      setUser(null);
      setUserDetails(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userDetails,
        login,
        logout,
        setUserDetails,
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
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};

export default AuthProvider;
