const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Password@123',
  database: 'your_database_name'
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Get all users
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { username, mobile, email, city, gender, date_of_registration, dob } = req.body;
  const sql = 'INSERT INTO users (username, mobile, email, city, gender, date_of_registration, dob) VALUES (?, ?, ?, ?, ?, ?, ?)';
  pool.query(sql, [username, mobile, email, city, gender, date_of_registration, dob || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error creating user' });
    }
    res.status(201).json({
      id: result.insertId,
      username,
      mobile,
      email,
      city,
      gender,
      date_of_registration,
      dob,
    });
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const { username, mobile, email, city, gender, date_of_registration, dob } = req.body;
  const userId = req.params.id;
  const sql = 'UPDATE users SET username = ?, mobile = ?, email = ?, city = ?, gender = ?, date_of_registration = ?, dob = ? WHERE id = ?';
  pool.query(sql, [username, mobile, email, city, gender, date_of_registration, dob || null, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating user' });
    }
    res.json({
      id: userId,
      username,
      mobile,
      email,
      city,
      gender,
      date_of_registration,
      dob,
    });
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  pool.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
