import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../Css/HomePage.css';
import PostCard from './PostCard';

import travelImage from './../Assests/Travel.png';
import food from './../Assests/Food.png';
import Movie from './../Assests/Movie.png';
import Education from './../Assests/Education.png';
import Technology from './../Assests/Technology.png';
import Books from './../Assests/Books.png';
import Health from './../Assests/Health.png';
import Fashion from './../Assests/Fashion.png';
import Lifestyle from './../Assests/LifeStyle.png';

const categoryPosts = [
  { id: 'Travel Blog', title: 'Travel Blog', image: travelImage },
  { id: 'Food Blog', title: 'Food Blog', image: food },
  { id: 'Movies Blog', title: 'Movies Blog', image: Movie },
  { id: 'Education Blog', title: 'Education Blog', image: Education },
  { id: 'Technology Blog', title: 'Technology Blog', image: Technology },
  { id: 'Books Blog', title: 'Books Blog', image: Books },
  { id: 'Health Blog', title: 'Health Blog', image: Health },
  { id: 'Fashion Blog', title: 'Fashion Blog', image: Fashion },
  { id: 'Lifestyle Blog', title: 'Lifestyle Blog', image: Lifestyle }
];

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Get the current user on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.name) setCurrentUser(storedUser.name);
    fetchPosts();
  }, []);

  // Fetch all posts
  const fetchPosts = () => {
    axios.get('http://localhost:5000/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching posts:', err));
  };

  // Fetch posts by selected category
  const fetchPostsByCategory = (category) => {
    axios.get(`http://localhost:5000/posts/${category}`)
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching category posts:', err));
  };

  // Filter posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div className="homepage-container">
      <div className="index-section">
        {categoryPosts.map(category => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.title ? 'selected' : ''}`}
            onClick={() => {
              setSelectedCategory(category.title);
              fetchPostsByCategory(category.title);
            }}
          >
            <img src={category.image} alt={category.title} className="category-image" />
            <h4>{category.title}</h4>
          </div>
        ))}
      </div>
      <div className="details-section">
        {selectedCategory ? (
          filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onPostUpdated={fetchPosts}
              />
            ))
          ) : (
            <p>No posts found for {selectedCategory}</p>
          )
        ) : (
          <p>Select a blog category from the left to view posts.</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
