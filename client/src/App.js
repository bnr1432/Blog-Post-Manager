import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import Homepage from './Pages/HomePage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CreatePost from './Pages/CreatePost';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import ProtectedRoute from './Pages/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected route example */}
        <Route
          path="/create-post"
          element={
            <ProtectedRoute user={user}>
              <CreatePost user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
