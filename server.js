const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configure MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',              // MySQL root username
    password: '7611',         // MySQL root password
    database: 'payroll'       // Use the 'payroll' database
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Login route
app.post('/login', (req, res) => {
    const { userid, password } = req.body;

    // Query to check login credentials
    const query = 'SELECT * FROM access_details WHERE userid = ? AND password = ?';
    
    connection.execute(query, [userid, password], (err, results) => {
        if (err) {
            console.error(err);
            res.send('<p>Error occurred. Please try again.</p>');
            return;
        }

        if (results.length > 0) {
            res.send('<p>Login successful!</p>');
        } else {
            res.send('<p>Invalid userid or password.</p>');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});