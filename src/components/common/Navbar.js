// src/components/common/Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2>Exam Management System</h2>
            <ul>
                <li>Home</li>
                <li>Logout</li>
            </ul>
        </nav>
    );
};

export default Navbar;
