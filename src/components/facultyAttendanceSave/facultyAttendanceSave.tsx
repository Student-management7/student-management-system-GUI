import React, { useState, useEffect } from 'react';
import FacultyTable from './facultyTable';
import { fetchFacultyData, submitAttendance } from '../../services/Faculty/FacultyAttendanceSave/Api';
import { Faculty } from '../../services/Faculty/FacultyAttendanceSave/Type';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './FacultyAttendanceSave.css'; // Assuming external CSS for styles

const FacultyAttendanceSave: React.FC = () => {
    const [facultyList, setFacultyList] = useState<Faculty[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // For loading state

    // Fetch faculty data
    useEffect(() => {
        const loadFacultyData = async () => {
            try {
                setError('');
                const data = await fetchFacultyData();
                setFacultyList(data);
            } catch (error) {
                console.error('Error fetching faculty data:', error);
                setError('Error fetching faculty data. Please try again.');
            }
        };
        loadFacultyData();
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
                toast.success('Attendance submitted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                const updatedData = await fetchFacultyData();
                setFacultyList(updatedData);
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
          
            toast.error('Error submitting attendance. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="attendance-box">
            {error && <div className="error-message">{error}</div>}
            <FacultyTable facultyList={facultyList} onAttendanceSelect={handleAttendanceSelect} />

            <button className="submit-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Attendance'} 
            </button>
               
           
            <ToastContainer />
        </div>
    );
};

export default FacultyAttendanceSave;
