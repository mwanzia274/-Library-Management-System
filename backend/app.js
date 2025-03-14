const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'library_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Add Book Endpoint
app.post('/books', (req, res) => {
  const {
    title,
    author,
    publisher,
    isbn,
    genre,
    category_id,
    shelf_id,
    published_year,
    copies_available
  } = req.body;

  const sql = `INSERT INTO books 
    (title, author, publisher, isbn, genre, category_id, shelf_id, published_year, copies_available) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    title,
    author,
    publisher,
    isbn,
    genre,
    category_id,
    shelf_id,
    published_year,
    copies_available
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting book:', err);
      return res.status(500).json({ error: 'Error adding book to database' });
    }
    res.status(201).json({ message: 'Book added successfully!' });
  });
});

app.listen(5000, () => {
  console.log('🚀 Server is running on http://localhost:5000');
});
