import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../Css/CreatePost.css';


const categories = [
  'Travel Blog', 'Food Blog', 'Movies Blog', 'Education Blog',
  'Technology Blog', 'Books Blog', 'Health Blog', 'Fashion Blog', 'Lifestyle Blog'
];

const CreatePost = ({ user }) => {
  const [formData, setFormData] = useState({
    category: '',
    content: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in
    if (!user || !user.name) {
      return alert('Login required');
    }

    // Validate form data
    if (!formData.category || !formData.content || !formData.image) {
      return alert('All fields are required');
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.category);
    data.append('content', formData.content);
    data.append('author', user.name);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      await axios.post('http://localhost:5000/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Create Post</h2>
        
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        
        <textarea
          name="content"
          value={formData.content}
          placeholder="Content"
          onChange={handleChange}
          required
        />
        
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
      
      <button type="button" onClick={() => navigate('/')}>
        Back
      </button>
    </div>
  );
};

export default CreatePost;
