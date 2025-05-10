import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './../Css/PostCard.css';

const PostCard = ({ post, currentUser, onPostUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [expanded, setExpanded] = useState(false); // For the "View More / View Less" button
  const [expandedComments, setExpandedComments] = useState(false); // Added state for expanding comments

  const fetchComments = useCallback(() => {
    axios.get(`http://localhost:5000/comments/${post.id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error('Error fetching comments:', err));
  }, [post.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    axios.post('http://localhost:5000/comments', {
      postId: post.id,
      userId: storedUser?.id || null,
      content: newComment,
      authorName: storedUser?.name || 'Anonymous'
    }).then(() => {
      setNewComment('');
      fetchComments();
    }).catch(err => console.error('Error adding comment:', err));
  };

  const handleEdit = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.put(`http://localhost:5000/posts/${post.id}`, {
        title: post.title,
        content: editedContent,
        userId: storedUser?.id
      });
      setIsEditing(false);
      onPostUpdated();
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDelete = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.delete(`http://localhost:5000/posts/${post.id}`, {
        data: { userId: storedUser?.id }
      });
      onPostUpdated();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleDeleteComment = (commentId) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    axios.delete(`http://localhost:5000/comments/${commentId}`, {
      data: { userId: storedUser?.id }
    }).then(fetchComments)
      .catch(err => console.error('Error deleting comment:', err));
  };

  // Ensure we are comparing the current logged-in user with the post's author
  const canEditOrDeletePost = currentUser && currentUser === post.author;

  return (
    <div className="post-card">
      {post.image_url && (
        <img src={`http://localhost:5000/uploads/${post.image_url}`} alt={post.title} className="post-image" />
      )}
      <h3>{post.title}</h3>

      {isEditing ? (
        <>
          <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <div className={`post-content ${expanded ? 'expanded' : ''}`}>
            {post.content}
          </div>
          {post.content.length > 200 && (
            <button className="view-toggle" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'View Less' : 'View More'}
            </button>
          )}
        </>
      )}

      <p><i>by {post.author}</i></p>

      {/* Show edit/delete buttons only if the logged-in user is the post author */}
      {canEditOrDeletePost && (
        <div className="post-controls">
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      <div className="comment-section">
        <h4>Comments</h4>
        <div className="comment-list">
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.slice(0, expandedComments ? comments.length : 3).map(comment => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.author_name}:</strong> {comment.content}</p>
              {currentUser === comment.author_name && (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
        {comments.length > 3 && !expandedComments && (
          <button className="view-toggle" onClick={() => setExpandedComments(!expandedComments)}>
            {expandedComments ? 'View Less' : 'View More'}
          </button>
        )}
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
