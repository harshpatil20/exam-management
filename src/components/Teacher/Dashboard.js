// src/components/Teacher/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import QuestionPaperThumbnail from './QuestionPaperThumbnail';
import axios from 'axios';
import './style/Dashboard.css';

const Dashboard = () => {
    const [questionPapers, setQuestionPapers] = useState([]);

    useEffect(() => {
        const fetchQuestionPapers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/question-papers');
                if (response.data.success) {
                    setQuestionPapers(response.data.papers);
                }
            } catch (error) {
                console.error('Error fetching question papers', error);
            }
        };

        fetchQuestionPapers();
    }, []);

    const handleDelete = (id) => {
        setQuestionPapers(questionPapers.filter(paper => paper.id !== id));
    };

    return (
        <div>
            <Navbar />
            <h1><center>Teacher Dashboard</center></h1>
            <div className="button-container">
                <Link to="/teacher/create-student" className="dashboard-btn create-student-btn">
                    Create Student Account
                </Link>
                <Link to="/teacher/create-question-paper" className="dashboard-btn create-question-btn">
                    Create MCQ Question Paper
                </Link>
            </div>

            <div className="question-papers">
                <h2><center>Your Question Papers</center></h2>
                {questionPapers.length === 0 ? (
                    <p>No question papers created yet.</p>
                ) : (
                    <div className="question-papers-grid">
                        {questionPapers.map((paper) => (
                            <QuestionPaperThumbnail key={paper.id} paper={paper} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
