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



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
