import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

interface AddInquiryModalProps {
  onClose: () => void;
  onAdd: (inquiry: Omit<Inquiry, 'id'>) => Promise<void>;
}

interface Inquiry {
  id: number;
  schoolName: string;
  location: string;
  adminContactInfo: string;
  inquiryDate: string;
  currentStatus: 'Interested' | 'Follow-up' | 'Converted' | 'Closed';
  notes: string;
}

const AddInquiryModal: React.FC<AddInquiryModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Omit<Inquiry, 'id'>>({
    schoolName: '',
    location: '',
    adminContactInfo: '',
    inquiryDate: new Date().toISOString().split('T')[0],
    currentStatus: 'Interested',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData);
      onClose();
    } catch (error) {
      console.error('Error adding inquiry:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add New Inquiry</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-4">
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School Name</label>
              <input
                type="text"
                name="schoolName"
                id="schoolName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.schoolName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="adminContactInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Contact Info</label>
              <input
                type="text"
                name="adminContactInfo"
                id="adminContactInfo"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.adminContactInfo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="inquiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inquiry Date</label>
              <input
                type="date"
                name="inquiryDate"
                id="inquiryDate"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.inquiryDate}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="currentStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</label>
              <select
                name="currentStatus"
                id="currentStatus"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.currentStatus}
                onChange={handleChange}
              >
                <option value="Interested">Interested</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Add Inquiry
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInquiryModal;

