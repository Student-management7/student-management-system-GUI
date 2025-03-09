import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
   userId?: string;
  [key: string]: any;
}

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

interface UserDetails {
  email: string;
  role: string;
  facultyInfo?: {
    fact_Name: string;
  };
  schoolCreationEntity?: {
    ownerName: string;
  };
  adminCreationEntity?: {
    name: string;
  };
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
    const checkInitialToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && currentTime < decoded.exp) {
            setIsAuthenticated(true);
            setUser(decoded);

            // Retrieve userDetails from localStorage
            const storedUserDetails = localStorage.getItem('userDetails');
            if (storedUserDetails) {
              setUserDetails(JSON.parse(storedUserDetails));
            }
          } else {
            await logout();
          }
        } catch (error) {
          await logout();
        }
      }
      setIsLoading(false);
    };
    checkInitialToken();
  }, []);

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

      // Decode the token
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
      localStorage.removeItem('userDetails'); // Clear user details from localStorage
      setIsAuthenticated(false);
      setUser(null);
      setUserDetails(null);
      setIsLoading(false);
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
        userDetails,
        login,
        logout,
        setUserDetails: (details) => {
          setUserDetails(details);
          if (details) {
            localStorage.setItem('userDetails', JSON.stringify(details));
          } else {
            localStorage.removeItem('userDetails');
          }
        },
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
