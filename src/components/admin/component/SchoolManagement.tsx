import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon,  } from '@heroicons/react/24/outline';
import SchoolDetails from './SchoolDetails';
import AddNewSchoolModal from './AddNewSchoolModal';
import Spinner from './Spinner';
import axiosInstance from '../../../services/Utils/apiUtils';
import ReusableTable from '../../MUI Table/ReusableTable';

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
  renewalDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

const SchoolManagement: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const statusCellRenderer = ({ value }: { value: School['status'] }) => {
    const statusColor = {
      'Active': 'bg-green-100 text-green-800',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[value] || 'bg-gray-100 text-gray-800'}`}>
        {value}
      </span>
    );
  };

  const actionCellRenderer = ({ data }: { data: School }) => {
    return (
      <button
        className="text-indigo-600 hover:text-indigo-900 mr-3"
        onClick={() => setSelectedSchool(data)}
      >
        View Details
      </button>
    );
  };

  const columns = [
    {
      field: 'schoolName',
      headerName: 'School Name',
      
      sortable: true
    },
    {
      field: 'schoolCode',
      headerName: 'School Code',
      
      sortable: true
    },
    {
      field: 'schoolAddress',
      headerName: 'Address',
      
      sortable: true
    },
    {
      field: 'adminContact',
      headerName: 'Admin Contact',
      
      sortable: true
    },
    {
      field: 'email',
      headerName: 'Email',
      
      sortable: true
    },
    {
      field: 'currentPlan',
      headerName: 'Current Plan',
      
      sortable: true
    },
    {
      field: 'renewalDate',
      headerName: 'Renewal Date',
      
      sortable: true
    },
    {
      field: 'status',
      headerName: 'Status',
      
      sortable: true,
      cellRenderer: statusCellRenderer
    },
    {
      field: 'actions',
      headerName: 'Actions',
      
      sortable: false,
      cellRenderer: actionCellRenderer
    }
  ];

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/school/get');
      const data: School[] = response.data;
      setSchools(data);
      toast.success('Schools loaded successfully');
    } catch (err) {
      toast.error('Error fetching schools. Please try again later.');
      console.error('Error fetching schools:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const addNewSchool = async (newSchool: Omit<School, 'id' | 'creationDateTime' | 'schoolCode'>) => {
    try {
      const response = await axiosInstance.post('/school/save', newSchool, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const addedSchool: School = response.data;
      setSchools((prevSchools) => [...prevSchools, addedSchool]);
      setShowModal(false);
      toast.success('New school added successfully');
    } catch (error) {
      console.error('Error adding new school:', error);
      toast.error('Failed to add new school. Please try again.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">School Management</h1>

      {selectedSchool ? (
        <SchoolDetails school={selectedSchool} onBack={() => setSelectedSchool(null)} />
      ) : (
       
        <ReusableTable
          columns={columns}
          rows={schools}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableHeight="auto"
          tableWidth="auto"
        />
        
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {showModal && (
        <AddNewSchoolModal
          onClose={() => setShowModal(false)}
          onAddSchool={addNewSchool}
        />
      )}
    </div>
  );
};

export default SchoolManagement;