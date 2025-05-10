import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Css/Register.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    mobile: '',
    age: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };
  

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

        <button type="submit">Submit</button>
        <button type="button" className="back-button" onClick={() => navigate('/login')}>Back</button>
      </form>
    </div>
  );
};

export default Register;
