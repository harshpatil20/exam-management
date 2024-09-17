// src/components/Student/TakeTest.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './style/TakeTest.css';

import { useStudent } from '../../context/StudentContext';


const TakeTest = () => {
    const { id } = useParams();  // Get question paper ID from URL
    // const history = useHistory();
    const [isTestSubmitted, setIsTestSubmitted] = useState(false); // New state for tracking submission status

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    // const studentId = localStorage.getItem('studentId');



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
                    }
                } catch (error) {
                    console.error('Error checking submission status:', error);
                }
            
        };

        fetchQuestions();
        checkSubmissionStatus(); // Check submission status on component mount

    }, [id]);


    
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

    return (
        <div className="take-test">
            <h1>Take Test</h1>
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
                     <button 
                        className="submit-btn" 
                        onClick={handleSubmit} 
                        disabled={isTestSubmitted} // Disable button if test is already submitted
                    >
                       {isTestSubmitted ? 'Test Submitted' : 'Submit Test'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TakeTest;
