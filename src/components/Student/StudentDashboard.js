// src/components/Student/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import Navbar from '../common/Navbar';
import './style/StudentDashboard.css';

const StudentDashboard = () => {
    const [questionPapers, setQuestionPapers] = useState([]);

    useEffect(() => {
        const fetchInitiatedPapers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/initiated-question-papers');
                if (response.data.success) {
                    setQuestionPapers(response.data.papers);
                }
            } catch (error) {
                console.error('Error fetching question papers', error);
            }
        };

        fetchInitiatedPapers();
    }, []);

    return (
        
        
        <div className="student-dashboard">
            <h1>Available Question Papers</h1>
            <div className="question-papers-grid">
                {questionPapers.length === 0 ? (
                    <p>No question papers available yet.</p>
                ) : (
                    questionPapers.map((paper) => (
                        <div key={paper.id} className="paper-thumbnail">
                            <h3>{paper.title}</h3>
                            <button className="view-btn">
                                <a href={`/student/take-test/${paper.id}`}>Take Test</a>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
