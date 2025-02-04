import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddInquiryModal from './AddInquiryModal';
import EditInquiryStatusModal from './EditInquiryStatusModal';
import Spinner from './Spinner';
import axiosInstance from '../../../services/Utils/apiUtils';

interface Inquiry {
  id: number;
  schoolName: string;
  location: string;
  adminContactInfo: string;
  inquiryDate: string;
  currentStatus: 'Interested' | 'Follow-up' | 'Converted' | 'Closed';
  notes: string;
}



const InquiryManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null); //Removed error state

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<Inquiry[]>('/inquire/get');
      setInquiries(response.data);
      setFilteredInquiries(response.data);
      toast.success('Inquiries loaded successfully');
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      toast.error('Error fetching inquiries. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterInquiries(term, statusFilter);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterInquiries(searchTerm, status);
  };

  const filterInquiries = (term: string, status: string) => {
    const filtered = inquiries.filter((inquiry) => {
      const matchesTerm = inquiry.schoolName.toLowerCase().includes(term) ||
                          inquiry.location.toLowerCase().includes(term) ||
                          inquiry.adminContactInfo.toLowerCase().includes(term);
      const matchesStatus = status === '' || inquiry.currentStatus === status;
      return matchesTerm && matchesStatus;
    });
    setFilteredInquiries(filtered);
  };

  const handleAddInquiry = async (newInquiry: Omit<Inquiry, 'id'>) => {
    try {
      const response = await axiosInstance.post<Inquiry>('inquire/save', newInquiry);
      const addedInquiry = response.data;
      setInquiries([...inquiries, addedInquiry]);
      setFilteredInquiries([...filteredInquiries, addedInquiry]);
      setShowAddModal(false);
      toast.success('New inquiry added successfully');
    } catch (err) {
      console.error('Error adding inquiry:', err);
      toast.error('Failed to add inquiry. Please try again.');
    }
  };
  
  const handleEditStatus = async (id: number, newStatus: Inquiry['currentStatus']) => {
    try {
      const response = await axiosInstance.patch<Inquiry>(`inquire/edit?id=${id}`, { currentStatus: newStatus });
      const updatedInquiry = response.data;
  
      const updatedInquiries = inquiries.map(inquiry =>
        inquiry.id === id ? updatedInquiry : inquiry
      );
  
      setInquiries(updatedInquiries);
      setFilteredInquiries(updatedInquiries);
      setShowEditModal(false);
      setSelectedInquiry(null);
      toast.success('Inquiry status updated successfully');
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      toast.error('Failed to update inquiry status. Please try again.');
    }
  };

  const statusColor = (status: Inquiry['currentStatus']) => {
    switch (status) {
      case 'Interested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900';
      case 'Follow-up':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
      case 'Converted':
        return 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  //Removed error handling block

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Inquiry Management</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search inquiries..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="">All Statuses</option>
          <option value="Interested">Interested</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Converted">Converted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Inquiry Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                School Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Admin Contact Info
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Inquiry Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Current Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inquiry) => (
              <tr key={inquiry.id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{inquiry.schoolName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{inquiry.location}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{inquiry.adminContactInfo}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{inquiry.inquiryDate}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(inquiry.currentStatus)}`}>
                    {inquiry.currentStatus}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{inquiry.notes}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Inquiry Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {/* Add Inquiry Modal */}
      {showAddModal && (
        <AddInquiryModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddInquiry}
        />
      )}

      {/* Edit Inquiry Status Modal */}
      {showEditModal && selectedInquiry && (
        <EditInquiryStatusModal
          inquiry={selectedInquiry}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInquiry(null);
          }}
          onSave={handleEditStatus}
        />
      )}
    </div>
  );
};

export default InquiryManagement;

