import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/Utils/apiUtils';

const UserPassword: React.FC = () => {
  const userDetailsString = localStorage.getItem('userDetails');
  const userDetails = JSON.parse(userDetailsString || '{}');
  const userEmail = userDetails.email || 'N/A';

  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password is empty
    if (!password) {
      toast.error('Please enter a new password.');
      return;
    }

    // Check if password length is less than 6
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/edit', {
        email: userEmail,
        password: password,
      });

      toast.success('Password updated successfully!');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password.');
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='box m-4 p-4'>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="head1">Change Password</h2>
      <form onSubmit={handleSubmit} className="">
        <div className='row'>
          <div className='col-6'>
            <label>Email</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="form-control"
            />
          </div>
          <div className='col-6'>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter new password"
              required
            />
          </div>
        </div>
        <div className='row mt-4'>
          <button
            type="submit"
            disabled={loading}
            className={`btn col-2 button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPassword;