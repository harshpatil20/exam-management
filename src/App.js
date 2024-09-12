// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectRole from './components/Auth/SelectRole';
import Login from './components/Auth/Login';
import StudentLogin from './components/Auth/StudentLogin';
import TeacherDashboard from './components/Teacher/Dashboard';
import CreateStudent from './components/Teacher/createStudent';

import StudentDashboard from './components/Student/StudentDashboard';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SelectRole />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/student-login" element={<StudentLogin />} />
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/create-student" element={<CreateStudent />} />
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
