// src/components/Auth/SelectRole.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectRole.css';  // Make sure the path is correct

const SelectRole = () => {
    const navigate = useNavigate();

    const handleStudentLogin = () => {
        navigate('/student-login');
    };

    const handleTeacherLogin = () => {
        navigate('/login');
    };

    return (
        <div className="select-role-container">
            <div className="select-role-box">
                <h1>Select Your Role</h1>
                <button className="select-role-button student" onClick={handleStudentLogin}>
                    Student
                </button>
                <button className="select-role-button teacher" onClick={handleTeacherLogin}>
                    Teacher
                </button>
            </div>
        </div>
    );
};

export default SelectRole;
