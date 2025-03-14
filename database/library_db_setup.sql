
-- 🔄 Reset existing database
DROP DATABASE IF EXISTS library_db;

-- 📁 Create fresh database
CREATE DATABASE library_db;

-- 🔀 Use the new database
USE library_db;

-- 📚 Book Categories
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

-- 🗄️ Book Shelves
CREATE TABLE shelves (
    shelf_id INT AUTO_INCREMENT PRIMARY KEY,
    shelf_name VARCHAR(50) UNIQUE NOT NULL,
    location_description VARCHAR(100)
);

-- 📘 Books Table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(100),
    publisher VARCHAR(100),
    isbn VARCHAR(30) UNIQUE,
    genre VARCHAR(50),
    category_id INT,
    shelf_id INT,
    published_year YEAR,
    copies_available INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (shelf_id) REFERENCES shelves(shelf_id)
);

-- 👥 Members Table
CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    membership_date DATE,
    status ENUM('Active', 'Inactive') DEFAULT 'Active'
);

-- 🧑‍💼 Librarians Table
CREATE TABLE librarians (
    librarian_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20)
);

-- 🔐 User Login Table (members & librarians)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(100),
    role ENUM('member', 'librarian', 'admin'),
    related_id INT,
    FOREIGN KEY (related_id) REFERENCES members(member_id) ON DELETE CASCADE
);

-- 📤 Borrow Records
CREATE TABLE borrow_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    member_id INT,
    borrow_date DATE,
    due_date DATE,
    return_date DATE,
    librarian_id INT,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (librarian_id) REFERENCES librarians(librarian_id)
);

-- 💰 Penalties Table
CREATE TABLE penalties (
    penalty_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT,
    amount DECIMAL(10,2),
    status ENUM('Pending', 'Paid') DEFAULT 'Pending',
    FOREIGN KEY (record_id) REFERENCES borrow_records(record_id)
);

-- 📆 Reservation Table
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    member_id INT,
    reservation_date DATE,
    status ENUM('Pending', 'Fulfilled', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id)
);

-- 📣 Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    message TEXT,
    notification_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Unread', 'Read') DEFAULT 'Unread',
    FOREIGN KEY (member_id) REFERENCES members(member_id)
);

-- 🧾 Audit Logs Table
CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    table_name VARCHAR(50),
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 📥 Insert Sample Data

-- Categories
INSERT INTO categories (category_name) VALUES
('Computer Science'), ('Literature'), ('History'), ('Science'), ('Fiction');

-- Shelves
INSERT INTO shelves (shelf_name, location_description) VALUES
('Shelf A1', 'Left Wing - Ground Floor'),
('Shelf B1', 'Right Wing - First Floor');

-- Books
INSERT INTO books (title, author, publisher, isbn, genre, category_id, shelf_id, published_year, copies_available) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', 'MIT Press', '9780262033848', 'Computer Science', 1, 1, 2009, 5),
('To Kill a Mockingbird', 'Harper Lee', 'Lippincott', '9780061120084', 'Fiction', 5, 2, 1960, 3),
('1984', 'George Orwell', 'Secker & Warburg', '9780451524935', 'Dystopian', 5, 1, 1949, 4),
('Clean Code', 'Robert Martin', 'Prentice Hall', '9780132350884', 'Software', 1, 2, 2008, 2);

-- Members
INSERT INTO members (first_name, last_name, email, phone_number, membership_date) VALUES
('Alice', 'Wanjiru', 'alice@example.com', '0712345678', '2024-01-10'),
('Brian', 'Mutua', 'brian@example.com', '0723456789', '2024-02-15'),
('Carol', 'Otieno', 'carol@example.com', '0734567890', '2024-03-01');

-- Librarians
INSERT INTO librarians (name, email, phone_number) VALUES
('James Njoroge', 'james@library.com', '0700111222'),
('Diana Wambui', 'diana@library.com', '0711223344');

-- Users
INSERT INTO users (username, password_hash, role, related_id) VALUES
('alice_user', 'hash123', 'member', 1),
('brian_user', 'hash456', 'member', 2),
('librarian_james', 'hash789', 'librarian', 1);

-- Borrow Records
INSERT INTO borrow_records (book_id, member_id, borrow_date, due_date, return_date, librarian_id) VALUES
(1, 1, '2025-03-01', '2025-03-15', '2025-03-14', 1),
(2, 2, '2025-03-05', '2025-03-19', NULL, 2),
(3, 3, '2025-03-07', '2025-03-21', NULL, 2);

-- Penalties
INSERT INTO penalties (record_id, amount, status) VALUES
(1, 0.00, 'Paid'),
(2, 150.00, 'Pending');

-- Reservations
INSERT INTO reservations (book_id, member_id, reservation_date, status) VALUES
(4, 2, '2025-03-10', 'Pending');

-- Notifications
INSERT INTO notifications (member_id, message) VALUES
(2, 'Reminder: Book reservation for Clean Code is ready for pickup.');

-- Audit Logs
INSERT INTO audit_logs (user_id, action, table_name) VALUES
(1, 'Borrowed a book', 'borrow_records'),
(2, 'Made a reservation', 'reservations');