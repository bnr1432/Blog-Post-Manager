import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/HomePage.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>My Blog</div>
      <div className="navbar-right">
        {user ? (
          <>
            <span>Welcome, {user.name}!</span>
            <button onClick={() => navigate('/create-post')}>Create Post</button>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
