const express = require('express');
const app = express();
const port = 3000;

const mysql = require('mysql2');
const bodyParser = require('body-parser');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // replace with your MySQL username
    password: '7611',  // replace with your MySQL password
    database: 'payroll'   // replace with your database name
});

db.connect(err => {
    if (err) {throw err;
    console.log('MySQL connected...');
    }
        console.log('MySQL connected...');
});
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS for templating
app.set('view engine', 'ejs');




// Serve static files like HTML
app.use(express.static('public'));

// Import the function to get books
const { getBooks } = require('./public/book');

// Define a route to get the books
app.get('/books', (req, res) => {
    const bookshtml = getBooks();
    res.send(bookshtml);
});
app.get('/login', (req, res) => {
   // const bookshtml = getBooks();
   
    let html1 = '<h1>Login</h1>';
   
    res.send(html1);
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});