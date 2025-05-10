import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../Css/ForgotReset.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/forgot-password', { email });
      alert('Email verified. Proceed to reset password.');
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Error verifying email');
    }
  };

  return (
    <div className="forgot-reset-container">
      <form className="forgot-reset-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Verify Email</button>
        <div className="forgot-reset-back">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
