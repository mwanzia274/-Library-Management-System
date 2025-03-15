const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');

async function loadShelves() {
  try {
    const res = await fetch('http://localhost:5000/shelves');
    const shelves = await res.json();

    const shelfDropdown = document.getElementById('shelf_id');
    shelfDropdown.innerHTML = '<option value="">-- Select Shelf --</option>';

    shelves.forEach(shelf => {
      const option = document.createElement('option');
      option.value = shelf.shelf_id;
      option.textContent = `${shelf.shelf_name} (${shelf.location_description})`;
      shelfDropdown.appendChild(option);
    });

  } catch (error) {
    console.error('❌ Error loading shelves:', error);
  }
}

window.onload = () => {
  fetchBooks();
  loadShelves(); // ✅ Load dropdown when page loads
};

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookData = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    publisher: document.getElementById('publisher').value,
    isbn: document.getElementById('isbn').value,
    genre: document.getElementById('genre').value,
    category_id: parseInt(document.getElementById('category_id').value),
    shelf_id: parseInt(document.getElementById('shelf_id').value),
    published_year: parseInt(document.getElementById('published_year').value),
    copies_available: parseInt(document.getElementById('copies_available').value)
  };

  try {
    const res = await fetch('http://localhost:5000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });

    if (res.ok) {
      alert('✅ Book added successfully!');
      bookForm.reset();
      fetchBooks();
    } else {
      alert('❌ Failed to add book.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ Server connection failed');
  }
});

async function fetchBooks() {
  try {
    const res = await fetch('http://localhost:5000/books');
    const books = await res.json();

    bookList.innerHTML = '';
    books.forEach(book => {
      const li = document.createElement('li');
      li.innerHTML =
        `<div>
          <strong>${book.title}</strong> by ${book.author}<br>
          Genre: ${book.genre}, Year: ${book.published_year}
        </div>
        <button onclick="deleteBook(${book.book_id})">Delete</button>`;
      bookList.appendChild(li);
    });
  } catch (error) {
    console.error('❌ Error fetching books:', error);
  }
}

async function deleteBook(id) {
  try {
    const res = await fetch(`http://localhost:5000/books/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('✅ Book deleted successfully!');
      fetchBooks();
    } else {
      alert('❌ Failed to delete book');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}
