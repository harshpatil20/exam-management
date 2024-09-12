// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const cors = require('cors');



const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,POST', // Allow only specific HTTP methods
}));
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exam_management',
    password: 'root',
    port: 5432,
});

app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    console.log("in server js");
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
console.log("in try")
        if (result.rows.length > 0) {
            const storedPassword = result.rows[0].password;
console.log(storedPassword)

            const match = await bcrypt.compare(password, storedPassword);
           console.log(match)
            if (match) {
                console.log("logeed in")
                res.json({ success: true });
            } else {
                console.log("failed")
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


app.post('/api/create-student', async (req, res) => {
    const { name, classRoom, branch, userId, password } = req.body;

    console.log(req.body.password+" create student body")

    try {
        // Hash the plain-text password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the hashed password in the database
        const result = await pool.query(
            'INSERT INTO students (name, class, branch, userid, password) VALUES ($1, $2, $3, $4, $5)',
            [name, classRoom, branch, userId, hashedPassword]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


app.post('/api/student-login', async (req, res) => {
    const { userId, password } = req.body;
    console.log(":::in student login api:::")

    try {
        // Check if the student exists
        const result = await pool.query('SELECT * FROM students WHERE userid = $1', [userId]);

        if (result.rows.length === 0) {
            // If no student with that userId is found
            console.log('User not found');
            return res.json({ success: false, message: 'User not found' });
        }

        const student = result.rows[0];
        console.log(student);

        // Compare the plain text password with the hashed password stored in DB
        const match = await bcrypt.compare(password, student.password);
console.log(match)
        if (match) {
            // Password matches
            console.log("matched")
            return res.json({ success: true });
        } else {
            // Password does not match
            return res.json({ success: false, message: 'Incorrect password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
