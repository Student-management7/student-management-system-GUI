// import React, { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { DownloadIcon } from 'lucide-react';

// // Mock data for charts
// const monthlyRevenueData = [
//   { month: 'Jan', revenue: 4000 },
//   { month: 'Feb', revenue: 3000 },
//   { month: 'Mar', revenue: 5000 },
//   { month: 'Apr', revenue: 4500 },
//   { month: 'May', revenue: 6000 },
//   { month: 'Jun', revenue: 5500 },
// ];

// const expiringPlansData = [
//   { month: 'Jul', expiring: 10 },
//   { month: 'Aug', expiring: 15 },
//   { month: 'Sep', expiring: 20 },
//   { month: 'Oct', expiring: 18 },
//   { month: 'Nov', expiring: 25 },
//   { month: 'Dec', expiring: 30 },
// ];

// // Mock data for upcoming expirations
// const upcomingExpirations = [
//   { id: 1, schoolName: 'Springfield Elementary', renewalDate: '2023-07-15', planStatus: 'Expiring Soon' },
//   { id: 2, schoolName: 'Riverdale High', renewalDate: '2023-08-01', planStatus: 'Active' },
//   { id: 3, schoolName: 'Hogwarts School', renewalDate: '2023-08-15', planStatus: 'Expiring Soon' },
//   { id: 4, schoolName: 'Xavier\'s School for Gifted Youngsters', renewalDate: '2023-09-01', planStatus: 'Active' },
//   { id: 5, schoolName: 'Sunnydale High', renewalDate: '2023-09-15', planStatus: 'Expiring Soon' },
// ];

// const ReportsAndAnalytics: React.FC = () => {
//   const [activeSchools, setActiveSchools] = useState(250);
//   const [expiringSoon, setExpiringSoon] = useState(15);
//   const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
//   const [outstandingPayments, setOutstandingPayments] = useState(7500);

//   const exportToCSV = () => {
//     const headers = ['School Name', 'Renewal Date', 'Plan Status'];
//     const dataToExport = upcomingExpirations.map(item => 
//       [item.schoolName, item.renewalDate, item.planStatus].join(',')
//     );
    
//     const csvContent = [
//       headers.join(','),
//       ...dataToExport
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', 'upcoming_expirations.csv');
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports and Analytics</h1>

//       {/* Dashboard Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Total Active Schools</h2>
//           <p className="text-3xl font-bold text-blue-600">{activeSchools}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Expiring Soon Plans</h2>
//           <p className="text-3xl font-bold text-yellow-600">{expiringSoon}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Monthly Revenue</h2>
//           <p className="text-3xl font-bold text-green-600">${monthlyRevenue.toLocaleString()}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Outstanding Payments</h2>
//           <p className="text-3xl font-bold text-red-600">${outstandingPayments.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Graphs */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={monthlyRevenueData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="revenue" fill="#4F46E5" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Expiring Plans Over Time</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={expiringPlansData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="expiring" stroke="#EF4444" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Reports Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Upcoming Expirations</h2>
//           <button
//             onClick={exportToCSV}
//             className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             <DownloadIcon className="h-5 w-5 mr-2" />
//             Export to CSV
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {upcomingExpirations.map((item) => (
//                 <tr key={item.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.schoolName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.renewalDate}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       item.planStatus === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
//                     }`}>
//                       {item.planStatus}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsAndAnalytics;

import React from 'react'

export default function ReportsAndAnalytics() {
  return (
    <div>ReportsAndAnalytics</div>
  )
}
