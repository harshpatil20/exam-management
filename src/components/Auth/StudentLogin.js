// src/components/Auth/StudentLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the common CSS file

const StudentLogin = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/student-login', {
                userId,
                password,
            });

            if (response.data.success) {
                navigate('/student/dashboard');
            } else {
                setErrorMessage('Invalid user ID or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Error logging in');
        }
    };

    return (
        <div className="login-container student-login">
            <h1>Student Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="submit-button">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default StudentLogin;
