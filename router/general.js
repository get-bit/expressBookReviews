const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Task 1: Get the book list available in the shop
public_users.get("/",function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
});

// Task 2: Get all books details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get all books details based on Author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found from this author" });
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found similar to this title" });
    }
});

//  Task 5: Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
