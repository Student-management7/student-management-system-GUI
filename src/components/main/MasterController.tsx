import React, { useEffect, useState } from 'react';
import { getStdDetails } from '../../services/studentRegistration/api/StudentRegistration';
import { getFacultyDetails } from '../../services/Faculty/fecultyRegistretion/API/API';
import { fetchNotifications } from '../../services/Notification/Api';
import { Link } from 'react-router-dom';
import Loader from '../loader/loader'; 

const MasterController = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student data
        const studentsResponse = await getStdDetails();
        setTotalStudents(studentsResponse.length);

        // Fetch faculty data
        const facultyResponse = await getFacultyDetails();
        setTotalFaculty(facultyResponse.data.length);

        // Fetch notifications data
        const notificationsResponse = await fetchNotifications();
        setTotalNotifications(notificationsResponse.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  // Display the Loader while data is being fetched
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6 font-sans">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="head1 mb-2">School Management Dashboard</h1>
        <p className="text-gray-600">Welcome in Easyway solution for managing your school operations.</p>
      </header>

      {/* Data Cards */}
      <div className="flex flex-col md:flex-row justify-around gap-6">
        {/* Total Students Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center w-full md:w-1/3">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Total Students</h2>
          <p className="text-4xl font-bold text-gray-900">{totalStudents}</p>
          <p className="text-sm text-gray-500 mt-2">Registered students in the school</p>
        </div>

        {/* Total Faculty Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center w-full md:w-1/3">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Total Faculty</h2>
          <p className="text-4xl font-bold text-gray-900">{totalFaculty}</p>
          <p className="text-sm text-gray-500 mt-2">Teaching and non-teaching staff</p>
        </div>

        {/* Total Notifications Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center w-full md:w-1/3">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Total Notifications</h2>
          <p className="text-4xl font-bold text-gray-900">{totalNotifications}</p>
          <p className="text-sm text-gray-500 mt-2">Active notifications and alerts</p>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h2 className="head1 mb-4">Recent Activities</h2>
          <ul className="space-y-3">
            <li className="text-gray-600">New student registration completed</li>
            <li className="text-gray-600">Faculty meeting scheduled</li>
            <li className="text-gray-600">Exam timetable published</li>
          </ul>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h2 className="head1 mb-4">Upcoming Events</h2>
          <ul className="space-y-3">
            <li className="text-gray-600">Annual Sports Day - 26th Oct</li>
            <li className="text-gray-600">Parent-Teacher Meeting - 30th Oct</li>
            <li className="text-gray-600">School Annual Function - 15th Nov</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h2 className="head1 mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link to="/studentRegistrationController" className="text-blue-600 hover:underline">View Student List</Link>
            </li>
            <li>
              <Link to="/facultyRegistration" className="text-blue-600 hover:underline">View Faculty List</Link>
            </li>
            <li>
              <Link to="/viewNotification" className="text-blue-600 hover:underline">View Notifications</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MasterController;