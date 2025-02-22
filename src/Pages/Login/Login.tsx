import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './login.scss';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 3;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

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
      errors.password = 'Password must be at least 3 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validateForm()) return;
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
      setErrorMessage('Login failed. Please check your credentials.');
      console.error('Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen md:bg-[white] ">
      <div className="hidden md:flex w-1/2 bg-[#126666]  justify-center items-center relative overflow-hidden">
        <div className="absolute bottom-10 animate-bounce text-white text-4xl font-bold">School Management</div>
      </div>
      <div className="w-full md:w-1/2  flex items-center justify-center p-6">
        <div className="bg-gray shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6  text-[#126666]">Login</h1>
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#126666]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>
            <div className="relative">
              <label className="block text-[#126666]">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-10 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
              </button>
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#126666] text-white rounded hover:bg-[#3a8686] transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center mt-4">
              <a href="/forgot-password" className="text-[#126666] hover:underline">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
