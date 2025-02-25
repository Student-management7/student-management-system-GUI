// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { fetchSchoolData } from '../../services/adminDeshboard/AdminDeshboard'
import BackButton from '../Navigation/backButton';

interface School {
    id: string;
    creationDateTime: string;
    schoolCode: string;
    schoolName: string;
    schoolAddress: string;
    adminContact: string;
    serviceStartDate: string;
    currentPlan: string;
    email: string;
    password: string | null;
    renewalDate: string;
    status: string;
    city: string;
    state: string;
    schoolLandlineNo: string;
    ownerName: string;
    gst: string;
    boardType: string;
    subscriptionType: string;
    roll: string | null;
}

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState({
        totalRegisteredSchools: 0,
        totalActiveSchools: 0,
        totalInactiveSchools: 0,
        upcomingRenewals: 0,
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const data: School[] = await fetchSchoolData();

                const totalRegisteredSchools = data.length;
                const totalActiveSchools = data.filter(school => school.status === 'Active').length;
                const totalInactiveSchools = data.filter(school => school.status === 'Inactive').length;

                const currentDate = new Date();
                const upcomingRenewals = data.filter(school => {
                    const renewalDate = new Date(school.renewalDate);
                    const diffInDays = Math.ceil((renewalDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
                    return diffInDays <= 30 && diffInDays > 0;
                }).length;

                setMetrics({
                    totalRegisteredSchools,
                    totalActiveSchools,
                    totalInactiveSchools,
                    upcomingRenewals,
                });
            } catch (error) {
                console.error('Error processing school data:', error);
            }
        };

        getData();
    }, []);

    return (

        <>
            <div className='box'>
                    <div className="flex items-center">
                        <span>
                        <BackButton />
                        </span>
                        <span>
                        <h1 className="head1 ">School Management Dashboard</h1>
                        </span>
                    </div>
                <div className="min-h-screen bg-White-100 p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Registered Schools */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold mb-2">Total Registered Schools</h2>
                            <p className="text-4xl font-bold text-blue-600">{metrics.totalRegisteredSchools}</p>
                        </div>

                        {/* Total Active Schools */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold mb-2">Total Active Schools</h2>
                            <p className="text-4xl font-bold text-green-600">{metrics.totalActiveSchools}</p>
                        </div>

                        {/* Total Inactive Schools */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold mb-2">Total Inactive Schools</h2>
                            <p className="text-4xl font-bold text-red-600">{metrics.totalInactiveSchools}</p>
                        </div>

                        {/* Upcoming Renewals */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold mb-2">Upcoming Renewals</h2>
                            <p className="text-4xl font-bold text-yellow-600">{metrics.upcomingRenewals}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
