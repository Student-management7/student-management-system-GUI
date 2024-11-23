
import React, { useState, useEffect } from 'react';
import FacultyTable from './facultyTable';
import { fetchFacultyData, submitAttendance } from '../../services/FacultyAttendanceSave/Api';
import { Faculty } from '../../services/FacultyAttendanceSave/Type';

const FacultyAttendanceSave: React.FC = () => {
    const [facultyList, setFacultyList] = useState<Faculty[]>([]);
    const [error, setError] = useState<string>('');


// Fetch faculty data

    useEffect(() => {
        (async () => {
            try {
                setError('');
                const data = await fetchFacultyData();
                setFacultyList(data);
            } catch (error) {
                setError('Error fetching faculty data. Please try again.');
            }
        })();
    }, []);


    // Handle attendance selection

    const handleAttendanceSelect = (value: string, id: string) => {
        setFacultyList(prevList =>
            prevList.map(faculty =>
                faculty.fact_id === id ? { ...faculty, attendance: value } : faculty
            )
        );
    };
    

    // Submit attendance

    const handleSubmit = async () => {
        try {
            setError('');
            const response = await submitAttendance(facultyList);
            if (response.status === 200) {
                alert('Attendance submitted successfully!');
                const updatedData = await fetchFacultyData();
                setFacultyList(updatedData);
            }
        } catch (error) {
            setError('Error submitting attendance. Please try again.');
        }
    };

    return (
        <div className="box">
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <FacultyTable facultyList={facultyList} onAttendanceSelect={handleAttendanceSelect} />
            <button 
                onClick={handleSubmit}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                }}
            >
                Submit Attendance
            </button>
        </div>
    );
};

export default FacultyAttendanceSave;