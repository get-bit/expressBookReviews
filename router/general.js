const express = require('express');
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

/*
// Task 1: Get the book list available in the shop
public_users.get("/",function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
});
*/

// Task 10: Get book list with Promise
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books); // Resolving the promise with the list of books
  })
  .then((bookList) => res.status(200).json(bookList))
  .catch((err) => res.status(500).json({ error: "Error fetching books" }));
});

/*
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
*/

// Task 11: Get all books details based on ISBN with Promise
public_users.get('/isbn/:isbn', function (req, res) {
    let isbnParams = req.params.isbn;
  
    // Create a new promise
    const getBookByIsbn = new Promise((resolve, reject) => {
      // Check if the book exists in the books object
      let book = books[isbnParams];
  
      // If the book is found, resolve the promise
      if (book) {
        resolve(book);
      } else {
        // If the book is not found, reject the promise
        reject("Book not found");
      }
    });
  
    // Handle the promise
    getBookByIsbn
      .then((book) => {
        // Book is found, return it as response
        return res.status(200).json(book);
      })
      .catch((error) => {
        // Book not found, return error message
        return res.status(404).json({ message: error });
      });
  });  

/*
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
*/

// Task 12: Get all books details based on Author with Promise
public_users.get('/author/:author',function (req, res) {
    let authorName = req.params.author.trim().toLowerCase(); // Handle extra spaces and case-insensitivity
    let booksByAuthor = []; // Array to store books by the specified author
  
    // Check if authorName is empty
    if (!authorName) {
      return res.status(400).json({ message: "Author name is required." });
    }
  
    // Create a new promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
      // Iterate through all books and check the author's name
      for (let isbnKey in books) {
        let book = books[isbnKey];
  
        // If the book's author matches the requested author, add it to the results
        if (book.author.toLowerCase() === authorName) {
          booksByAuthor.push(book);
        }
      }
  
      // If books are found, resolve the promise, else reject with an error message
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author.");
      }
    });
  
    // Use the promise
    getBooksByAuthor
      .then((booksByAuthor) => {
        return res.status(200).json(booksByAuthor); // Return the books found by the author
      })
      .catch((error) => {
        return res.status(404).json({ message: error }); // Return error message if no books are found
      });
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
