const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com']  // Replace with your frontend domain
    : ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize server with database connection
const initializeServer = async () => {
  try {
    // Wait for the pool to be initialized
    const pool = await require('./config/db');

    // Create flashcards table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        level VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Flashcards table created or already exists');

    // Get all flashcards
    app.get('/api/flashcards', async (req, res) => {
      try {
        const [rows] = await pool.query('SELECT * FROM flashcards');
        res.json(rows);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get a single flashcard
    app.get('/api/flashcards/:id', async (req, res) => {
      try {
        const [rows] = await pool.query('SELECT * FROM flashcards WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
          return res.status(404).json({ message: 'Flashcard not found' });
        }
        res.json(rows[0]);
      } catch (error) {
        console.error('Error fetching flashcard:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Create a new flashcard
    app.post('/api/flashcards', async (req, res) => {
      try {
        const { question, answer, level } = req.body;
        const [result] = await pool.query(
          'INSERT INTO flashcards (question, answer, level) VALUES (?, ?, ?)',
          [question, answer, level]
        );
        res.status(201).json({ id: result.insertId, question, answer, level });
      } catch (error) {
        console.error('Error creating flashcard:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Update a flashcard
    app.put('/api/flashcards/:id', async (req, res) => {
      try {
        const { question, answer, level } = req.body;
        const [result] = await pool.query(
          'UPDATE flashcards SET question = ?, answer = ?, level = ? WHERE id = ?',
          [question, answer, level, req.params.id]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Flashcard not found' });
        }
        res.json({ id: req.params.id, question, answer, level });
      } catch (error) {
        console.error('Error updating flashcard:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Delete a flashcard
    app.delete('/api/flashcards/:id', async (req, res) => {
      try {
        const [result] = await pool.query('DELETE FROM flashcards WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Flashcard not found' });
        }
        res.json({ message: 'Flashcard deleted successfully' });
      } catch (error) {
        console.error('Error deleting flashcard:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Start server with port fallback
    const startServer = (port) => {
      try {
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        }).on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}`);
            startServer(port + 1);
          } else {
            console.error('Server error:', err);
          }
        });
      } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    };

    startServer(PORT);

  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer(); 