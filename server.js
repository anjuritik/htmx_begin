const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '7611', // Replace with your MySQL root password
    database: 'payroll'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to display login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to handle login submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Print the received username and password to the console
    console.log(`Received Username: ${username}`);
    console.log(`Received Password: ${password}`);

    // Query to validate user credentials
    pool.query(
        'SELECT * FROM access_details WHERE userid = ? AND password = ?',
        [username, password],
        (error, results) => {
            if (error) {
                return res.send(`<h2>Error</h2><p>${error.message}</p>`);
            }

            if (results.length > 0) {
                res.send('<h2>Login Successful</h2><p>Welcome!</p>');
            } else {
                res.send('<h2>Login Failed</h2><p>Invalid username or password.</p>');
            }
        }
    );
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});