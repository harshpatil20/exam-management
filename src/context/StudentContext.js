import React, { createContext, useState, useContext } from 'react';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
    const [studentId, setStudentId] = useState(null);

    return (
        <StudentContext.Provider value={{ studentId, setStudentId }}>
            {children}
        </StudentContext.Provider>
    );
};
