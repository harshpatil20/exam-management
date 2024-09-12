// src/components/Teacher/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <h1>Teacher Dashboard</h1>
            <ul className="dashboard-menu">
                <li><Link to="/teacher/create-student" className="dashboard-link">Create Student Account</Link></li>
                {/* Other dashboard links */}
            </ul>
        </div>
    );
};

export default Dashboard;
