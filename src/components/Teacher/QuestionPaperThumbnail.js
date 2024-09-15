// src/components/Teacher/QuestionPaperThumbnail.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style/QuestionPaperThumbnail.css';

const QuestionPaperThumbnail = ({ paper, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/question-paper/${paper.id}`);
            if (response.data.success) {
                alert('Question paper deleted successfully');
                onDelete(paper.id); // Call the onDelete function passed from the parent
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting question paper:', error);
            alert('Failed to delete question paper');
        }
    };

    return (
        <div className="paper-thumbnail">
            <h3>{paper.title}</h3>
            {/* <Link to={`/teacher/edit-question-paper/${paper.id}`} className="edit-btn">Edit</Link> */}
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default QuestionPaperThumbnail;
