const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API Routes
app.get('/api/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) {
      console.error('Error fetching flashcards:', err);
      res.status(500).json({ error: 'Failed to fetch flashcards' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/flashcards', (req, res) => {
  const { question, answer, level } = req.body;
  db.query(
    'INSERT INTO flashcards (question, answer, level) VALUES (?, ?, ?)',
    [question, answer, level],
    (err, result) => {
      if (err) {
        console.error('Error creating flashcard:', err);
        res.status(500).json({ error: 'Failed to create flashcard' });
        return;
      }
      res.status(201).json({ id: result.insertId, question, answer, level });
    }
  );
});

app.put('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer, level } = req.body;
  db.query(
    'UPDATE flashcards SET question = ?, answer = ?, level = ? WHERE id = ?',
    [question, answer, level, id],
    (err) => {
      if (err) {
        console.error('Error updating flashcard:', err);
        res.status(500).json({ error: 'Failed to update flashcard' });
        return;
      }
      res.json({ id, question, answer, level });
    }
  );
});

app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM flashcards WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting flashcard:', err);
      res.status(500).json({ error: 'Failed to delete flashcard' });
      return;
    }
    res.json({ message: 'Flashcard deleted successfully' });
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 