// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// DB setup
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Auth routes
app.post('/register', async (req, res) => {
  const { firstName, email, mobile, age, password } = req.body;
  if (!firstName || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO blog_users (first_name, email, mobile, age, password) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [firstName, email, mobile, age, hashedPassword]);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await db.query('SELECT * FROM blog_users WHERE email = ?', [email]);
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.first_name } });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Posts
app.post('/posts', upload.single('image'), async (req, res) => {
  const { title, content, author, category } = req.body;
  const image_url = req.file ? req.file.filename : null;
  try {
    const sql = 'INSERT INTO posts (title, content, author, category, image_url) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [title, content, author, category, image_url]);
    res.status(201).json({ message: 'Post created' });
  } catch (err) {
    console.error('Post error:', err);
    res.status(500).json({ error: 'Failed to save post' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Fetch error' });
  }
});

app.get('/posts/:category', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC', [req.params.category]);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Category fetch error' });
  }
});

app.put('/posts/:id', async (req, res) => {
  const { title, content, userId } = req.body;
  const postId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });

    const post = rows[0];
    const [userRow] = await db.query('SELECT * FROM blog_users WHERE id = ?', [userId]);
    const user = userRow[0];

    if (!user || user.first_name !== post.author) {
      return res.status(403).json({ message: 'Unauthorized to edit this post' });
    }

    await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId]);
    res.status(200).json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update error' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });

    const post = rows[0];
    const [userRow] = await db.query('SELECT * FROM blog_users WHERE id = ?', [userId]);
    const user = userRow[0];

    if (!user || user.first_name !== post.author) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await db.query('DELETE FROM posts WHERE id = ?', [postId]);
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete error' });
  }
});

// Comments
app.get('/comments/:postId', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [req.params.postId]);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Comment fetch error' });
  }
});

app.post('/comments', async (req, res) => {
  const { postId, userId, content, authorName } = req.body;
  try {
    const sql = 'INSERT INTO comments (post_id, user_id, content, author_name) VALUES (?, ?, ?, ?)';
    await db.query(sql, [postId, userId, content, authorName]);
    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ error: 'Comment save error' });
  }
});

app.delete('/comments/:id', async (req, res) => {
  const { userId } = req.body;
  try {
    const [result] = await db.query('DELETE FROM comments WHERE id = ? AND user_id = ?', [req.params.id, userId]);
    if (result.affectedRows === 0) return res.status(403).json({ error: 'Unauthorized or not found' });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete comment error' });
  }
});

// Verify email exists
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM blog_users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Email not found' });
    res.status(200).json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query('UPDATE blog_users SET password = ? WHERE email = ?', [hashed, email]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Email not found' });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Reset error' });
  }
});



app.listen(5000, () => console.log('Server running on port 5000'));
