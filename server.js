const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session'); // Add this line

const app = express();
const port = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


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

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));


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
                    req.session.user = usr;

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
//submit_complaint
app.post('/cms_entry', (req, res) => {
    const { qtr_no, qtr_zone, complain_type, details } = req.body;

    // Retrieve user info from session
    const user = req.session.user;
    console.log(user);

    if (user ) {
        // Insert complaint into the database
        pool.query(
            'INSERT INTO cms_txn (userid, qtr_no, qtr_zone, complaint_type, details) VALUES (?, ?, ?, ?, ?)',
            [user, qtr_no, qtr_zone, complain_type, details],
            (error, results) => {
                if (error) {
                    console.error(`Database Error: ${error.message}`);
                    return res.status(500).send('Internal server error.');
                }

                // Send a success response
               // res.send('Complaint submitted successfully.');
                res.redirect('/cms_entry');
            }
        );
    } else {
        res.redirect('/login');
    }
});
//View complaint history
// API endpoint to get complaint history for the logged-in user
app.get('/api/complaint-history', (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch complaint history for the logged-in user
    pool.query(
        'SELECT id as comp_id,qtr_no, qtr_zone, complaint_type, details,DATE_FORMAT(entry_date, "%d-%m-%Y") as date FROM cms_txn WHERE userid = ? ORDER BY ENTRY_DATE DESC',
        [user],
        (error, results) => {
            if (error) {
                console.error(`Database Error: ${error.message}`);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json(results);
        }
    );
});


// Route to display all complaints history for the logged-in user
app.get('/complaint-history', (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/login');
    }

    // Fetch all complaints for the logged-in user
    pool.query(
        'SELECT id as comp_id,qtr_no, qtr_zone, complaint_type, details, to_char(entry_date, "DD-MM-YYYY") as date FROM cms_txn WHERE userid = ? ORDER BY entry_date DESC',
        [user],
        (error, results) => {
            if (error) {
                console.error(`Database Error: ${error.message}`);
                return res.status(500).send('Internal server error.');
            }

            // Render the EJS template with the fetched data
            res.render('complaint_history', { complaints: results });
        }
    );
});
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});