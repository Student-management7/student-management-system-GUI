import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import formatDateToDDMMYYYY from './dateUtils';

interface School {
  schoolName: string;
  schoolAddress: string;
  adminContact: string;
  serviceStartDate: string;
  currentPlan: string;
  renewalDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  email: string;
  password: string;
}

interface AddNewSchoolModalProps {
  onClose: () => void;
  onAddSchool: (school: School) => Promise<void>;
}

const AddNewSchoolModal: React.FC<AddNewSchoolModalProps> = ({ onClose, onAddSchool }) => {
  const [formData, setFormData] = useState<School>({
    schoolName: '',
    schoolAddress: '',
    adminContact: '',
    serviceStartDate: '',
    currentPlan: 'Basic',
    renewalDate: '',
    status: 'Active',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<School>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Partial<School> = {};
    if (!formData.schoolName) newErrors.schoolName = 'School name is required';
    if (!formData.schoolAddress) newErrors.schoolAddress = 'Address is required';
    if (!formData.adminContact) newErrors.adminContact = 'Contact info is required';
    if (!formData.serviceStartDate) newErrors.serviceStartDate = 'Start date is required';
    if (!formData.renewalDate) newErrors.renewalDate = 'Renewal date is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formattedData = {
          ...formData,
          serviceStartDate: formatDateToDDMMYYYY(formData.serviceStartDate),
        };
        await onAddSchool(formattedData);
        onClose();
      } catch (error) {
        console.error('Error adding new school:', error);
      }
    }
  };
 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New School</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School Name</label>
            <input
              type="text"
              name="schoolName"
              id="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.schoolName && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.schoolName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              type="text"
              name="schoolAddress"
              id="schoolAddress"
              value={formData.schoolAddress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.schoolAddress && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.schoolAddress}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="adminContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Contact</label>
            <input
              type="text"
              name="adminContact"
              id="adminContact"
              value={formData.adminContact}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.adminContact && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.adminContact}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="serviceStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Start Date</label>
            <input
              type="date"
              name="serviceStartDate"
              id="serviceStartDate"
              value={formData.serviceStartDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.serviceStartDate && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.serviceStartDate}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="currentPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Plan</label>
            <select
              name="currentPlan"
              id="currentPlan"
              value={formData.currentPlan}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Renewal Date</label>
            <input
              type="date"
              name="renewalDate"
              id="renewalDate"
              value={formData.renewalDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.renewalDate && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.renewalDate}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Add School
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
  );
};

export default AddNewSchoolModal;

