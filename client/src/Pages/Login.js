import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/Login.css';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email: username, password });
      alert(res.data.message);
  
      const user = res.data.user;
  
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name }));
  
      // Pass the user info to App.js
      onLogin({ name: user.name, email: user.email });
  
      // Redirect to the homepage after login
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-links">
<a href="/forgot-password">Forgot password?</a>
        </div>
        <button type="submit">Login</button>
        <button type="button" className="back-button" onClick={() => navigate('/')}>Back</button>
        <div className="register-prompt">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
