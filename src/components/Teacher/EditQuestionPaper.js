// src/components/Teacher/EditQuestionPaper.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQuestionPaper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        console.log('Fetching question paper with ID:', id);
        const fetchQuestionPaper = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/question-paper/${id}`);
                if (response.data.success) {
                    setTitle(response.data.paper.title);
                    setQuestions(response.data.paper.questions || []);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Failed to fetch question paper.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionPaper();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/question-paper/${id}`, {
                title,
                questions
            });
            if (response.data.success) {
                alert('Question paper updated successfully');
                navigate('/teacher/dashboard');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating question paper:', error);
            alert('Failed to update question paper');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Edit Question Paper</h1>
            <form onSubmit={handleUpdate}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                {/* Add inputs for editing questions if needed */}
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditQuestionPaper;
