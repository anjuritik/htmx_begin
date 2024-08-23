const express = require('express');
const app = express();
const port = 3000;

// Serve static files like HTML
app.use(express.static('public'));

// Import the function to get books
const { getBooks } = require('./public/book');

// Define a route to get the books
app.get('/books', (req, res) => {
    const books = getBooks();
    let html = '<ul>';
    books.forEach(book => {
        html += `<li><strong>${book.title}</strong> by ${book.author} (${book.year})</li>`;
    });
    html += '</ul>';
    res.send(html);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});