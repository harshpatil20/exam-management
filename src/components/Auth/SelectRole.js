// src/components/Auth/SelectRole.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SelectRole = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === 'teacher') {
            navigate('/login');
        } else {
            alert("Student portal is under construction.");
        }
    };

    return (
        <div className="role-selection-container">
            <h1>Select Your Role</h1>
            <button onClick={() => handleRoleSelection('teacher')} className="role-button">Teacher</button>
            <button onClick={() => handleRoleSelection('student')} className="role-button">Student</button>
        </div>
    );
};

export default SelectRole;
