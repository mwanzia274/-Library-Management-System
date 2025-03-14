// frontend/script.js

const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');

// Load books on page load
window.onload = fetchBooks;

// Submit form to add book
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;

  const response = await fetch('http://localhost:5000/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, year })
  });

  if (response.ok) {
    alert('Book added successfully!');
    bookForm.reset();
    fetchBooks();
  } else {
    alert('Error adding book');
  }
});

// Fetch and display books
async function fetchBooks() {
  const res = await fetch('http://localhost:5000/books');
  const books = await res.json();

  bookList.innerHTML = '';
  books.forEach(book => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${book.title} - ${book.author} (${book.year})</span>
      <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
    `;
    bookList.appendChild(li);
  });
}

// Delete book
async function deleteBook(id) {
  const confirmDelete = confirm('Are you sure you want to delete this book?');
  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:5000/books/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    alert('Book deleted!');
    fetchBooks();
  } else {
    alert('Error deleting book');
  }
}
