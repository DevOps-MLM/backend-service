require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'expressdb'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.post('/notes', (req, res) => {
    const { title, body, archived } = req.body;
    const sql = 'INSERT INTO notes (title, body, archived) VALUES (?, ?, ?)';
    db.query(sql, [title, body, archived || false], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Post added successfully', id: result.insertId });
    });
  });
  
  app.get('/notes', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
  
  // Update a post
  app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, body, archived } = req.body;

    const updates = [];
    const sqlParams = [];

    if (title !== undefined) {
      updates.push('title = ?');
      sqlParams.push(title);
    }
    if (body !== undefined) {
      updates.push('body = ?');
      sqlParams.push(body);
    }
    if (archived !== undefined) {
      updates.push('archived = ?');
      sqlParams.push(archived);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    sqlParams.push(id);

    const sql = `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`;

    db.query(sql, sqlParams, (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });
      res.json({ message: 'Post updated successfully' });
    });
  });
  
  app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });
      res.json({ message: 'Post deleted successfully' });
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  


