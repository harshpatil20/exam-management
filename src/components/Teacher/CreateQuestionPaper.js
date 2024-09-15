// src/components/Teacher/CreateQuestionPaper.js
import React, { useState } from 'react';
import axios from 'axios';
import './style/CreateQuestionPaper.css';

const CreateQuestionPaper = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctOption: '' }
    ]);

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = event.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (qIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctOption = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/create-question-paper', {
                title,
                questions
            });
            if (response.data.success) {
                alert('Question Paper Created Successfully!');
                setTitle('');
                setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
            } else {
                alert('Failed to create question paper');
            }
        } catch (error) {
            alert('Error creating question paper');
        }
    };

    return (
        <div className="create-question-paper-container">
            <h1>Create MCQ Question Paper</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Question Paper Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-block">
                        <input
                            type="text"
                            placeholder={`Question ${qIndex + 1}`}
                            value={question.question}
                            onChange={(e) => handleQuestionChange(qIndex, e)}
                            required
                        />
                        {question.options.map((option, oIndex) => (
                            <input
                                key={oIndex}
                                type="text"
                                placeholder={`Option ${oIndex + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                required
                            />
                        ))}
                        <select
                            value={question.correctOption}
                            onChange={(e) => handleCorrectOptionChange(qIndex, e)}
                            required
                        >
                            <option value="">Select Correct Option</option>
                            <option value="0">Option 1</option>
                            <option value="1">Option 2</option>
                            <option value="2">Option 3</option>
                            <option value="3">Option 4</option>
                        </select>
                    </div>
                ))}
                <button type="button" onClick={addQuestion}>Add Another Question</button>
                <button type="submit">Create Question Paper</button>
            </form>
        </div>
    );
};

export default CreateQuestionPaper;
