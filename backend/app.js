// 📦 Required Modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789', // Your MySQL password
  database: 'library_db'  // Your database name
});

// 🔌 Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

// 🚀 Start Server
app.listen(5000, () => {
  console.log('📡 Server running on http://localhost:5000');
});

// ✅ Get All Books
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Add Book
app.post('/books', (req, res) => {
  const book = req.body;
  const sql = `INSERT INTO books (title, author, publisher, isbn, genre, category_id, shelf_id, published_year, copies_available)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    book.title,
    book.author,
    book.publisher,
    book.isbn,
    book.genre,
    book.category_id,
    book.shelf_id,
    book.published_year,
    book.copies_available
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting book:', err);
      return res.status(500).json({ error: err });
    }
    res.json({ message: '✅ Book added successfully' });
  });
});

// ✅ Delete Book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  db.query('DELETE FROM books WHERE book_id = ?', [bookId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Book deleted successfully' });
  });
});

// ✅ Update Book by ID
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;
  const sql = `UPDATE books
               SET title = ?, author = ?, publisher = ?, isbn = ?, genre = ?,
                   category_id = ?, shelf_id = ?, published_year = ?, copies_available = ?
               WHERE book_id = ?`;

  const values = [
    updatedBook.title,
    updatedBook.author,
    updatedBook.publisher,
    updatedBook.isbn,
    updatedBook.genre,
    updatedBook.category_id,
    updatedBook.shelf_id,
    updatedBook.published_year,
    updatedBook.copies_available,
    bookId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error updating book:', err);
      return res.status(500).json({ error: 'Failed to update book' });
    }
    res.json({ message: '✅ Book updated successfully' });
  });
});

// ✅ Get All Shelves
app.get('/shelves', (req, res) => {
  db.query('SELECT * FROM shelves', (err, results) => {
    if (err) {
      console.error('❌ Error fetching shelves:', err);
      return res.status(500).json({ error: 'Failed to load shelves' });
    }
    res.json(results);
  });
});

// ✅ Get All Categories
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('❌ Error fetching categories:', err);
      return res.status(500).json({ error: 'Failed to load categories' });
    }
    res.json(results);
  });
});
