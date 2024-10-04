// src/components/Student/TakeTest.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './style/TakeTest.css';

import { useStudent } from '../../context/StudentContext';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const TakeTest = () => {
    const { id } = useParams();  // Get question paper ID from URL
    // const history = useHistory();
    const [isTestSubmitted, setIsTestSubmitted] = useState(false); // New state for tracking submission status

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    // const studentId = localStorage.getItem('studentId');
    const [scoreData, setScoreData] = useState(null); 
    const [percentage, setPercentage] = useState(null);

    // const studentId = useStudent().id;


    let tempVar;


    useEffect(() => {
        // Fetch questions for the selected question paper
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/question-paper/${id}/questions`);
                if (response.data.success) {
                    setQuestions(response.data.questions);
                } else {
                    alert('Failed to load questions');
                }
            } catch (error) {
                console.error('Error fetching questions', error);
            }

        };

            //fetch submission
            const checkSubmissionStatus = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/submissions/status/${id}`);
                    if (response.data.submitted) {
                        setIsTestSubmitted(true);
                        fetchScore();
                    }
                } catch (error) {
                    console.error('Error checking submission status:', error);
                }
            
        };

        fetchQuestions();
        checkSubmissionStatus(); // Check submission status on component mount

    }, [id]);


    const fetchScore = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/scores/${id}`);
            if (response.data.success) {
                console.log("Fetched Percentage:", response.data.percentage); 
                setPercentage(response.data.percentage);
                tempVar = response.data.percentage;
            } else {
                alert('Could not fetch score');
            }
        } catch (error) {
            console.error('Error fetching score:', error);
        }
    };
    
    // Handle option selection
    const handleOptionChange = (questionId, optionId) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: optionId,
        }));
    };

    // Submit the answers
    const handleSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/question-paper/${id}/submit`,{answers});
        //     if (response.data.success) {
        //         alert('Test submitted successfully!');
        //     } else {
        //         alert('Failed to submit the test');
        //     }
        // } catch (error) {
        //     console.error('Error submitting test', error);
        //     alert('Error occurred while submitting the test');
        // }

        // const result = await response.json();

        if (response.data.success) {
            alert('Thank you for your response');
            // Redirect to main dashboard or other relevant page
            window.location.href = '/student/dashboard'; // Replace with your dashboard route
        } else {
            alert("error");
        }
    } catch (error) {
        console.error('Error submitting the test:', error);
        alert('An error occurred while submitting the test.');
    }
    };

    console.log(percentage)

    const data = percentage
        ? [
            { name: 'Correct', value: percentage },
            { name: 'Incorrect', value: 100 - percentage },
        ]
        : [];

    const COLORS = ['#00C49F', '#FF8042'];

    return (
        <div className="take-test">
            <h1>Take Test</h1>
            {isTestSubmitted ? (
                <>
                    <p>Thank you for your response.</p>
                    {percentage !== null ? (
                        <div className="score-display">
                            <h2>Your Score: {percentage}%</h2>
                        </div>
                    ) : (
                        <p>Loading your score...</p>
                    )}
                </>
            ) : (
                <>
                    {questions.length === 0 ? (
                        <p>No questions available for this test.</p>
                    ) : (
                        <div className="questions-list">
                            {questions.map((question) => (
                                <div key={question.id} className="question-item">
                                    <h4>{question.question_text}</h4>
                                    {question.options.map((option) => (
                                        <label key={option.id} className="option-label">
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={option.id}
                                                onChange={() => handleOptionChange(question.id, option.id)}
                                            />
                                            {option.option_text}
                                        </label>
                                    ))}
                                </div>
                            ))}
                            <button className="submit-btn" onClick={handleSubmit}>
                                Submit Test
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TakeTest;
