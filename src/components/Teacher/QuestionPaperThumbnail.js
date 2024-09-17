// src/components/Teacher/QuestionPaperThumbnail.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style/QuestionPaperThumbnail.css';

const QuestionPaperThumbnail = ({ paper, onDelete, onInitiate }) => {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this question paper?')) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/question-paper/${paper.id}`);
                if (response.data.success) {
                    alert('Question paper deleted successfully');
                    onDelete(paper.id);
                } else {
                    alert('Failed to delete question paper');
                }
            } catch (error) {
                console.error('Error deleting question paper:', error);
                alert('Error occurred while deleting the question paper');
            }
        }
    };

    const handleInitiate = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/initiate-question-paper/${paper.id}`);
            if (response.data.success) {
                alert('Question paper initiated successfully for students');
                onInitiate(paper.id);  // Trigger UI update if needed
            } else {
                alert('Failed to initiate question paper');
            }
        } catch (error) {
            console.error('Error initiating question paper:', error);
            alert('Error occurred while initiating the question paper');
        }
    };

    return (
        <div className="paper-thumbnail">
            <h3>{paper.title}</h3>
            {/* <Link to={`/teacher/edit-question-paper/${paper.id}`} className="edit-btn">Edit</Link> */}
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
            <button className="initiate-btn" onClick={handleInitiate}>Initiate</button>
        </div>
    );
};

export default QuestionPaperThumbnail;
