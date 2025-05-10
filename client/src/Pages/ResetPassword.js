import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../Css/ForgotReset.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/reset-password', {
        email,
        newPassword,
      });
      alert('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="forgot-reset-container">
      <form className="forgot-reset-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
        <div className="forgot-reset-back">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
