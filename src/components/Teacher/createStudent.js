// src/components/Teacher/CreateStudent.js
import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './style/CreateStudent.css';

const CreateStudent = () => {
    const [name, setName] = useState('');
    const [classRoom, setClassRoom] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const generateUserId = () => {
        // Generate random user ID (e.g., based on timestamp)
        const newUserId = 'STU' + Math.floor(Math.random() * 100000);
        setUserId(newUserId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const encryptedPassword = CryptoJS.SHA256(password).toString();

        try {
            const response = await axios.post('http://localhost:5000/api/create-student', {
                name,
                classRoom,
                branch,
                userId,
                password
            });

            if (response.data.success) {
                setSuccessMessage('Student account created successfully!');
                setName('');
                setClassRoom('');
                setBranch('');
                setPassword('');
                setUserId('');
            } else {
                setSuccessMessage('Failed to create student account.');
            }
        } catch (error) {
            setSuccessMessage('Error creating student account.');
        }
    };

    return (
        <div className="create-student-container">
            <h1>Create Student Account</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={classRoom}
                    onChange={(e) => setClassRoom(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                />
                <button type="button" onClick={generateUserId}>
                    Generate User ID
                </button>
                {userId && <p>User ID: {userId}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="submit-button">
                    Create Student
                </button>
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default CreateStudent;
