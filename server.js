const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
// }));


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
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query to fetch user details from the database
    pool.query(
        'SELECT * FROM access_details WHERE userid = ?',
        [username],
        (error, results) => {
            if (error) {
                console.error(`Database Error: ${error.message}`);
                return res.status(500).send('Internal server error.');
            }

            if (results.length > 0) {
                const usr = results[0].userid;
                const pass = results[0].password;

                // Directly compare the provided password with the stored password
                if (password === pass) {
                    // Print username to the console
                    console.log(`Login Successful for user: ${usr}`);

                    // Send a plain text response
                   // res.send(`Login Successful, ${usr}!`);
                   // req.session.user = usr;

                    // Redirect to the complaint submission page
                    res.redirect('/cms_entry');
                } else {
                    res.send('Login Failed: Invalid username or password.');
                }
            } else {
                res.send('Login Failed: Invalid username or password.');
            }
        }
    );
});
app.get('/cms_entry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'complaint_entry.html'));
});
// Route to display complaint entry form
app.post('/submit_complaint', (req, res) => {
    const { qtr_no, qtr_zone, complain_type, details } = req.body;

    // Retrieve user info from session
   // const user = req.session.user;--

    if (user && user.username) {
        // Insert complaint into the database
        pool.query(
            'INSERT INTO cms_txn (userid, qtr_no, qtr_zone, complain_type, details) VALUES (?, ?, ?, ?, ?)',
            [user.username, qtr_no, qtr_zone, complain_type, details],
            (error, results) => {
                if (error) {
                    console.error(`Database Error: ${error.message}`);
                    return res.status(500).send('Internal server error.');
                }

                // Send a success response
                res.send('Complaint submitted successfully.');
            }
        );
    } else {
        res.redirect('/login');
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});