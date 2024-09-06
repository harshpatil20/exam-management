// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectRole from './components/Auth/SelectRole';
import Login from './components/Auth/Login';
import Dashboard from './components/Teacher/Dashboard';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SelectRole />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/teacher/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
