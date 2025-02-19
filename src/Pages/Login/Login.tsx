import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import HeaderLogin from '../../components/main/OutLookHeader/headerLogin';
import './login.scss';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 3; // Minimum 8 characters
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { login, setUserDetails } = useAuth();
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      const response = await fetch('https://s-m-s-keyw.onrender.com/self', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user details.');
      const data = await response.json();
      setUserDetails(data); // Update context with user details
      localStorage.setItem('userDetails', JSON.stringify(data));
      navigate('/main');
    } catch (error) {
      const errorMsg = error instanceof Error
        ? error.message
        : 'Login failed. Please check your credentials.';

      setErrorMessage(errorMsg);
      console.error('Login Error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      handleSubmit(e);
    }
  }, [isLoading, handleSubmit]);

  return (
    <>
      <HeaderLogin />
      <div className='container-fluid'>
        <div className='row logiginBody'>
          <div className='col-md-7 p-0 login-left-sec'>
            <div className='banner2'>
              <div className='login-overlay'>
                <div className='loging-hedding-contnr'>
                  <h1>Welcome to Website</h1>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-5 p-0 login-right-sec'>
            <div className='banner1'>
              <div className='loginPage'>
                <form onSubmit={handleFormSubmit} className="p-8" noValidate>
                  <h1 className="text-3xl font-bold mb-6">Login</h1>
                  {errorMessage && (
                    <div role="alert" className="mb-4 p-3 text-red-700 bg-red-100 rounded border border-red-300">
                      {errorMessage}
                    </div>
                  )}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) {
                          setFormErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                      aria-invalid={!!formErrors.email}
                      aria-describedby="email-error"
                      autoComplete="email"
                      required
                    />
                    {formErrors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) {
                          setFormErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your password"
                      aria-invalid={!!formErrors.password}
                      aria-describedby="password-error"
                      autoComplete="current-password"
                      required
                    />
                    {formErrors.password && (
                      <p id="password-error" className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2 text-white rounded transition-colors duration-300 flex items-center justify-center ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    Login
                  </button>
                  <div className='flex items-center justify-center'>
                    {isLoading ? <span className="loader mr-2"></span> : ''}
                  </div>
                  <div className="mt-4 text-center">
                    <a href="/forgot-password" className="text-blue-500 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
