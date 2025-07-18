import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStdDetails } from '../../services/studentRegistration/api/StudentRegistration';
import { getFacultyDetails } from '../../services/Faculty/fecultyRegistretion/API/API';
import { fetchNotifications } from '../../services/Notification/Api';
import { Link } from 'react-router-dom';
import Loader from '../loader/loader';

interface Student {
  id: string;
  name: string;
  // Add more fields based on your API response
}

interface Faculty {
  id: string;
  name: string;
  // Add more fields based on your API response
}

interface FacultyResponse {
  data: Faculty[];
}

interface Notification {
  id: string;
  title: string;
  // Add more fields if needed
}



const MasterController: React.FC = () => {
const {
  data: students,
  isLoading: isStudentsLoading,
  isError: isStudentsError,
} = useQuery<Student[]>({
  queryKey: ['students'],
  queryFn: getStdDetails,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
});

const {
  data: faculty,
  isLoading: isFacultyLoading,
  isError: isFacultyError,
} = useQuery<FacultyResponse>({
  queryKey: ['faculty'],
  queryFn: getFacultyDetails,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
});

const {
  data: notifications,
  isLoading: isNotificationsLoading,
  isError: isNotificationsError,
} = useQuery<Notification[]>({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
});

  const loading = isStudentsLoading || isFacultyLoading || isNotificationsLoading;
  const error = isStudentsError || isFacultyError || isNotificationsError;

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-gray-50 p-6">
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 School Management Dashboard</h1>
      <p className="text-gray-600 text-lg">
        Welcome to Easyway – your smart school operation hub.
      </p>
    </header>

    {/* Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatCard
        title="Total Students"
        value={students?.length || 0}
        color="text-blue-600"
        description="Registered students in the school"
      />
      <StatCard
        title="Total Faculty"
        value={faculty?.data?.length || 0}
        color="text-purple-600"
        description="Teaching and non-teaching staff"
      />
      <StatCard
        title="Total Notifications"
        value={notifications?.length || 0}
        color="text-green-600"
        description="Active notifications and alerts"
      />
    </div>

    {/* Dashboard Sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SectionCard
        title="📌 Recent Activities"
        items={[
          '✅ New student registration completed',
          '📅 Faculty meeting scheduled',
          '🗓️ Exam timetable published',
        ]}
      />

      <SectionCard
        title="🎉 Upcoming Events"
        items={[
          '🏃 Annual Sports Day - 26th Oct',
          '👨‍👩‍👧 Parent-Teacher Meeting - 30th Oct',
          '🎭 School Annual Function - 15th Nov',
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🔗 Quick Links</h2>
        <ul className="space-y-3 text-blue-600 font-medium">
          <li>
            <Link to="/studentRegistrationController" className="hover:underline">📚 View Student List</Link>
          </li>
          <li>
            <Link to="/facultyRegistration" className="hover:underline">👩‍🏫 View Faculty List</Link>
          </li>
          <li>
            <Link to="/viewNotification" className="hover:underline">🔔 View Notifications</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

};

interface StatCardProps {
  title: string;
  value: number;
  color: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, description }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center w-full md:w-1/3">
    <h2 className={`text-2xl font-semibold ${color} mb-4`}>{title}</h2>
    <p className="text-4xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-2">{description}</p>
  </div>
);

interface SectionCardProps {
  title: string;
  items: string[];
}

const SectionCard: React.FC<SectionCardProps> = ({ title, items }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
    <h2 className="head1 mb-4">{title}</h2>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="text-gray-600">{item}</li>
      ))}
    </ul>
  </div>
);

export default MasterController;
