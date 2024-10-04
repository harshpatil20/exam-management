// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const cors = require('cors');


const session = require('express-session');


const app = express();


app.use(session({
    secret: '9c2d4f27d8c07d917b0e5f3e5bc2b5a1a8631e12a78a37b98b6d6c5f6e8f6a2b0', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
}));
// app.use(cors({
//     origin: 'http://localhost:3000', // Allow only this origin
//     methods: 'GET,POST', // Allow only specific HTTP methods
// }));

app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exam_management',
    password: 'root',
    port: 5432,
});

 let sId;
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const storedPassword = result.rows[0].password;

            const match = await bcrypt.compare(password, storedPassword);
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

    try {
        // Check if the student exists
        const result = await pool.query('SELECT * FROM students WHERE userid = $1', [userId]);

        if (result.rows.length === 0) {
            // If no student with that userId is found
            return res.json({ success: false, message: 'User not found' });
        }


        const student = result.rows[0];
        const studentId = result.rows[0].id;
        req.session.studentId = studentId;
         sId = req.session.studentId

        // Compare the plain text password with the hashed password stored in DB
        const match = await bcrypt.compare(password, student.password);
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


app.post('/api/create-question-paper', async (req, res) => {
    const { title, questions } = req.body;

    try {
        // Insert the question paper
        const result = await pool.query(
            'INSERT INTO question_papers (title) VALUES ($1) RETURNING id',
            [title]
        );
        const paperId = result.rows[0].id;

        // Insert the questions and options
        for (let question of questions) {
            // First, insert the question without the correct option (we'll update it later)
            const questionResult = await pool.query(
                'INSERT INTO questions (paper_id, question_text) VALUES ($1, $2) RETURNING id',
                [paperId, question.question]
            );
            const questionId = questionResult.rows[0].id;

            let correctOptionId = null;

            // Insert options for each question
            for (let i = 0; i < question.options.length; i++) {
                const optionResult = await pool.query(
                    'INSERT INTO options (question_id, option_text) VALUES ($1, $2) RETURNING id',
                    [questionId, question.options[i]]
                );
                const optionId = optionResult.rows[0].id;


               
                if ( i === parseInt(question.correctOption, 10)) {
                    correctOptionId = optionId;
                }
            }

            // Now that we have the correct option ID, update the question with the correct_option ID
            await pool.query(
                'UPDATE questions SET correct_option_id = $1 WHERE id = $2',
                [correctOptionId, questionId]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});




// server.js
// server.js (Add this route to your server)
app.get('/api/question-papers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM question_papers');
        res.json({ success: true, papers: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch question papers' });
    }
});


// server.js (Add this route to your server)
app.delete('/api/question-paper/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM question_papers WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Question paper deleted successfully.' });
        } else {
            res.json({ success: false, message: 'Question paper not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete question paper' });
    }
});


// server.js (Add this route to your server)
app.put('/api/question-paper/:id', async (req, res) => {
    const { id } = req.params;
    const { title, questions } = req.body; // Assuming title and questions are the fields being updated

    try {
        const result = await pool.query(
            'UPDATE question_papers SET title = $1, questions = $2 WHERE id = $3 RETURNING *',
            [title, JSON.stringify(questions), id]
        );
        if (result.rows.length > 0) {
            res.json({ success: true, paper: result.rows[0], message: 'Question paper updated successfully.' });
        } else {
            res.json({ success: false, message: 'Question paper not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update question paper' });
    }
});


// server.js
app.get('/api/question-paper/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM question_papers WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json({ success: true, paper: result.rows[0] });
        } else {
            res.json({ success: false, message: 'Question paper not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch question paper' });
    }
});

// server.js
app.post('/api/initiate-question-paper/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Assuming we have a `question_papers` table with a `status` field that can be updated
        const result = await pool.query('UPDATE question_papers SET status = $1 WHERE id = $2', ['initiated', id]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Question paper initiated successfully' });
        } else {
            res.json({ success: false, message: 'Question paper not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to initiate question paper' });
    }
});


// server.js
app.get('/api/initiated-question-papers', async (req, res) => {
    try {
        // Fetch only question papers with status = 'initiated'
        const result = await pool.query('SELECT * FROM question_papers WHERE status = $1', ['initiated']);
        res.json({ success: true, papers: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch initiated question papers' });
    }
});



// server.js
// server.js
app.post('/api/question-paper/:id/submit', async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body;
    const studentId = req.session.studentId; // Retrieve studentId from session

    // if (!studentId) {
    //     return res.status(400).json({ success: false, message: 'Not authenticated' });
    // }

    try {

        const submissionCheck = await pool.query(
            'SELECT * FROM submissions WHERE student_id = $1 AND paper_id = $2',
            [studentId, id]
        );

        if (submissionCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Response already submitted' });
        }

        // Fetch all questions for the paper to ensure you get the total number of questions
        const questionResult = await pool.query('SELECT id, correct_option_id FROM questions WHERE paper_id = $1', [id]);
        const questions = questionResult.rows;

        let totalQuestions = questions.length;
        let correctAnswers = 0;

        for (const question of questions) {
            const questionId = question.id;
            const correctOptionId = question.correct_option_id;


            // Compare the submitted answer with the correct answer
            const submittedOptionId = answers[questionId]; // Get the submitted option for this question
            console.log("submitted option id ::::"+submittedOptionId)
            const isCorrect = parseInt(submittedOptionId) === correctOptionId;

            console.log("iscorrect? "+isCorrect)
            if (isCorrect) {
                correctAnswers++;
            }

            // Insert submission into the database
            await pool.query(
                'INSERT INTO submissions (student_id, paper_id, question_id, selected_option_id, correct) VALUES ($1, $2, $3, $4, $5)',
                [sId, id, questionId, submittedOptionId, isCorrect]
            );
        }

        // Calculate the percentage of correct answers
        const percentage = (correctAnswers / totalQuestions) * 100;

        // Store the score in the scores table
        await pool.query(
            'INSERT INTO scores (student_id, paper_id, score) VALUES ($1, $2, $3) ON CONFLICT (student_id, paper_id) DO UPDATE SET score = EXCLUDED.score',
            [sId, id, percentage]
        );

        res.json({ success: true, message: 'Test submitted successfully!', percentage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to submit the test.' });
    }
});






// server.js
app.get('/api/question-paper/:id/questions', async (req, res) => {
    const { id } = req.params;
    try {
        // Assuming `questions` and `options` tables are joined to get questions and their options
        const result = await pool.query(`
            SELECT q.id AS question_id, q.question_text, o.id AS option_id, o.option_text
            FROM questions q
            LEFT JOIN options o ON q.id = o.question_id
            WHERE q.paper_id = $1
        `, [id]);

        // Process result to format questions and options correctly
        const questions = processQuestionsAndOptions(result.rows);

        res.json({ success: true, questions });
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch questions' });
    }
});

function processQuestionsAndOptions(rows) {
    const questions = {};
    rows.forEach(row => {
        if (!questions[row.question_id]) {
            questions[row.question_id] = {
                id: row.question_id,
                question_text: row.question_text,
                options: []
            };
        }
        questions[row.question_id].options.push({
            id: row.option_id,
            option_text: row.option_text
        });
    });
    return Object.values(questions);
}

app.get('/api/submissions/status/:paperId', async (req, res) => {
    const { paperId } = req.params;
    const studentId = req.session.studentId; // Retrieve studentId from session

    console.log("in the main api")
    console.log(sId);

    if (!sId) {
        return res.status(400).json({ success: false, message: 'Not authenticated' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM submissions WHERE student_id = $1 AND paper_id = $2',
            [sId, paperId]
        );

        const submitted = result.rows.length > 0;

        res.json({ success: true, submitted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to check submission status.' });
    }
});


// In your backend
// Backend API to get the percentage score for a specific student and question paper
app.get('/api/scores/:paperId', async (req, res) => {
    const {paperId } = req.params;

    try {
        const result = await pool.query(
            'SELECT score FROM scores WHERE student_id = $1 AND paper_id = $2',
            [sId, paperId]
        );
        console.log("in the api")
        if (result.rows.length > 0) {
            const percentage = result.rows[0].score;
            console.log(result.rows[0].score);
            console.log(percentage);
            res.json({ success: true, percentage });
        } else {
            res.json({ success: false, message: 'Score not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
