import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

//  validation 
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

  const { login } = useAuth();
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

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Successful login 
      navigate('/main'); 
    } catch (error) {
      const errorMsg = error instanceof Error 
        ? error.message 
        : 'Login failed. Please check your credentials.';
      
      setErrorMessage(errorMsg);
      
      // Optional: Add error logging or analytics tracking
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
    <div className="box flex items-center justify-center">
      <form 
        onSubmit={handleFormSubmit} 
        className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md"
        noValidate // Disable browser default validation
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        {errorMessage && (
          <div 
            role="alert" 
            className="mb-4 p-3 text-red-700 bg-red-100 rounded border border-red-300"
          >
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear specific email error when user starts typing
              if (formErrors.email) {
                setFormErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
            className={`w-full px-3 py-2 border rounded 
              ${formErrors.email ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Enter your email"
            aria-invalid={!!formErrors.email}
            aria-describedby="email-error"
            autoComplete="email"
            required
          />
          {formErrors.email && (
            <p 
              id="email-error" 
              className="text-red-500 text-sm mt-1"
            >
              {formErrors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label 
            htmlFor="password" 
            className="block text-gray-700 mb-2"
          >
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
            className={`w-full px-3 py-2 border rounded 
              ${formErrors.password ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Enter your password"
            aria-invalid={!!formErrors.password}
            aria-describedby="password-error"
            autoComplete="current-password"
            required
          />
          {formErrors.password && (
            <p 
              id="password-error" 
              className="text-red-500 text-sm mt-1"
            >
              {formErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`
            w-full py-2 text-white rounded transition-colors duration-300
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          `}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <a 
            href="/forgot-password" 
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;

