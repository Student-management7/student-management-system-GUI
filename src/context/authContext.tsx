import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  userId?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean; // Add isLoading to the interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  //   for debugging 

  //--------------------------------------------------------
  useEffect(() => {
    console.warn('AUTH STATE CHANGED:', {
      isAuthenticated, 
      user, 
      token: localStorage.getItem('token')
    });
  }, [isAuthenticated, user]);
//--------------------------------------------------------


// Modified login method
const login = async (email: string, password: string): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await fetch('https://s-m-s-keyw.onrender.com/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', 
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    const { token } = data;
    
    // Validate token
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Store token securely
    localStorage.setItem('token', token);
    document.cookie = `Authorization=Bearer ${token}; path=/; secure; samesite=strict`;
    
    setIsAuthenticated(true);
    setUser(decoded);
  } catch (err: any) {
    console.error('Login Error:', err);
    setIsAuthenticated(false);
    setUser(null);
    // You might want to throw the error or handle it more specifically
    throw err;
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  const checkInitialToken = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

//  debug 
        const isTokenValid = Date.now() / 1000 < decoded.exp;
        console.log('Is Token Valid:', isTokenValid);
//

        if (currentTime < decoded.exp) {
          setIsAuthenticated(true);
          setUser(decoded);
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

 const logout = async () => {
  try {
    
    await fetch('https://s-m-s-keyw.onrender.com/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-CSRF-Token': getCsrfToken()
      }
    }).catch(err => console.warn('Logout API call failed:', err));
  } finally {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false); //  loading 
  }
};
  
 
  const getCsrfToken = () => {
    // Fallback method
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
  
    console.log('CSRF Token Sources:', {
      metaToken,
      cookieToken
    });
  
    return metaToken || cookieToken || '';
  };
  

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      isLoading // Provide isLoading state
    }}>
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



