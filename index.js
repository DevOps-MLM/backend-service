require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

// Connect to SQLite database (it will create the file if it doesn't exist)
const db = new sqlite3.Database(path.resolve(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to SQLite database.');
});

// Create the notes table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  archived BOOLEAN NOT NULL DEFAULT 0
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Create a post
app.post('/posts', (req, res) => {
  const { title, body, archived } = req.body;
  const sql = 'INSERT INTO notes (title, body, archived) VALUES (?, ?, ?)';
  db.run(sql, [title, body, archived || false], function(err) {
    if (err) return res.status(500).send(err.message);
    res.json({ message: 'Post added successfully', id: this.lastID });
  });
});

// Get all posts
app.get('/posts', (req, res) => {
  const sql = 'SELECT * FROM notes';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Update a post
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, body, archived } = req.body;
  const sql = 'UPDATE notes SET title = ?, body = ?, archived = ? WHERE id = ?';
  db.run(sql, [title, body, archived, id], function(err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post updated successfully' });
  });
});

// Delete a post
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) return res.status(500).send(err.message);
    if (this.changes === 0) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
