const mysql = require('mysql2/promise');
require('dotenv').config();

// First create a connection without specifying a database
const initPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and create main connection pool
const initialize = async () => {
  try {
    // Create database if it doesn't exist
    await initPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'flashcard_db'}`);
    console.log('Database created or already exists');

    // Create the main connection pool with the database specified
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'flashcard_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    await pool.query('SELECT 1');
    console.log('Successfully connected to MySQL database');
    
    return pool;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Export the promise of the initialized pool
module.exports = initialize(); 