// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import SelectRole from './components/Auth/SelectRole';
import Login from './components/Auth/Login';
import StudentLogin from './components/Auth/StudentLogin';
import TeacherDashboard from './components/Teacher/Dashboard';
import CreateStudent from './components/Teacher/createStudent';

import StudentDashboard from './components/Student/StudentDashboard';
import CreateQuestionPaper from './components/Teacher/CreateQuestionPaper';

import EditQuestionPaper from './components/Teacher/EditQuestionPaper';

import TakeTest from './components/Student/TakeTest';
import { StudentProvider } from './context/StudentContext';

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
                    <Route path="/teacher/create-question-paper" element={<CreateQuestionPaper />} />
                    <Route path="/teacher/edit-question-paper/:id" component={EditQuestionPaper} />
                    {/* <Route path="/student/take-test/:id" component={TakeTest} /> */}
                    {/* <Route path='/student/take-test/:id' element={<TakeTest />} /> */}
                    <Route path="/student/take-test/:id" element={<TakeTest/>} exact />



                </Routes>
            </div>
         
        </Router>
    );
}

export default App;
