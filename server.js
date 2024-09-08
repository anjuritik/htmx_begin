const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session'); // Add this line
const { Console } = require('console');

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
                const rl_= results[0].role_;
                const isAdmin = results[0].role_ === 'admin'; // Assuming you have a role field
                // Directly compare the provided password with the stored password
                if (password === pass) {
                    // Print username to the console
                    console.log(`Login Successful for user: ${usr}`);

                    // Send a plain text response
                   // res.send(`Login Successful, ${usr}!`);
                    req.session.user = usr;
                   // req.session.isAdmin = isAdmin; // Store admin status in session
                    // Redirect to the complaint submission page
                    
                 if (isAdmin) {
                  
                    res.redirect('/cms_admin');
                  }
                  else
                  {   res.redirect('/cms_entry');

                  }

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
// Delete complaint route
app.delete('/api/delete-complaint/:id', (req, res) => {
    const complaintId = req.params.id;

    pool.query('DELETE FROM cms_txn WHERE id = ?', [complaintId], (error, results) => {
        if (error) {
            console.error('Error deleting complaint:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Complaint not found' });
        }
    });
});
// API endpoint to get complaint history for admin
app.get('/api/complaint-history-admin', (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch complaint history for all complaints without user filtering
    pool.query(
        'SELECT id as comp_id, qtr_no, qtr_zone, complaint_type, details, DATE_FORMAT(entry_date, "%d-%m-%Y") as date FROM cms_txn where status is null ORDER BY entry_date DESC',
        (error, results) => {
            if (error) {
                console.error(`Database Error: ${error.message}`);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json(results);
        }
    );
});
//////////////////////////////////////////


app.get('/api/admin_disall', (req, res) => {
    // Check if user is admin
    if (!req.session.isAdmin) {
        return res.status(403).send('Access denied.');
    }

    // Query to fetch pending complaints
    pool.query('SELECT * FROM cms_txn WHERE status is null', (error, pendingResults) => {
        if (error) {
            console.error(`Database Error: ${error.message}`);
            return res.status(500).send('Internal server error.');
        }

        // Query to fetch cleared complaints
        pool.query('SELECT * FROM cms_txn WHERE status = "cleared"', (error, clearedResults) => {
            if (error) {
                console.error(`Database Error: ${error.message}`);
                return res.status(500).send('Internal server error.');
            }

            // Respond with combined results
            res.json({
                pendingComplaints: pendingResults,
                clearedComplaints: clearedResults
            });
        });
    });
});
//Route to display all complaints history for the logged-in user
app.get('/cms_admin', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'cms_admin_new.html'));
});
// Route to display all complaints history for the logged-in users
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
// Fetch complaint details by ID
app.get('/api/complaint/:id', (req, res) => {
    const comp_id = req.params.id;

    // SQL query to get complaint details
    const sql = 'SELECT * FROM cms_txn WHERE id = ?';
    pool.query(sql, [comp_id], (err, results) => {
        if (err) {
            console.error('Error fetching complaint details:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json(results[0]); // Send the first result as JSON response
    });
});

// Update endpoint to update complaint details
app.put('/api/complaint/:id', (req, res) => {
    const comp_id = req.params.id;
    const { remark_by_admin, status_by_admin } = req.body;

    const sql = `UPDATE cms_txn SET remark_by_admin = ?, status_by_admin = ? WHERE id = ?`;
    const values = [remark_by_admin, status_by_admin, comp_id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating complaint:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }
        res.status(200).json({ message: 'Complaint updated successfully' });
    });
});
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});