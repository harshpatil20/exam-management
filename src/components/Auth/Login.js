// src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import CryptoJS from 'crypto-js';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // const encryptedPassword = CryptoJS.SHA256(password).toString();
        console.log('Login button clicked'); // Check if this log appears

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password
            });
            console.log(response.data); // Log the entire response
            console.log(response.data.success);
            if (response.data.success) {
                console.log("in login")
                navigate('/teacher/dashboard');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h1>Teacher Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
