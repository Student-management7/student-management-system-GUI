import React, { useState } from 'react';

interface School {
  id: number;
  name: string;
  address: string;
  contactInfo: string;
  principalInfo: string;
  startDate: string;
  currentPlan: string;
  planStartDate: string;
  planEndDate: string;
  // renewalDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

interface EditSchoolModalProps {
  school: School;
  onClose: () => void;
  onSave: (updatedSchool: School) => void;
}


interface EditSchoolModal{
  id: number;
  name: string;
  address: string;
  contactInfo: string;
  principalInfo: string;
  startDate: string;
  currentPlan: string;
  planStartDate: string;
  planEndDate: string;
  // renewalDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

const EditSchoolModal: React.FC<EditSchoolModalProps> = ({ school, onClose, onSave }) => {
  const [formData, setFormData] = useState<School>(school);
  const [errors, setErrors] = useState<Partial<School>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Partial<School> = {};
    if (!formData.name) newErrors.name = 'School name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contactInfo) newErrors.contactInfo = 'Contact info is required';
    if (!formData.principalInfo) newErrors.principalInfo = 'Principal info is required';
    if (!formData.currentPlan) newErrors.currentPlan = 'Current plan is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit School</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">School Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                id="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.contactInfo && <p className="mt-2 text-sm text-red-600">{errors.contactInfo}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="principalInfo" className="block text-sm font-medium text-gray-700">Principal/Admin Info</label>
              <input
                type="text"
                name="principalInfo"
                id="principalInfo"
                value={formData.principalInfo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.principalInfo && <p className="mt-2 text-sm text-red-600">{errors.principalInfo}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="currentPlan" className="block text-sm font-medium text-gray-700">Current Plan</label>
              <select
                name="currentPlan"
                id="currentPlan"
                value={formData.currentPlan}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a plan</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              {errors.currentPlan && <p className="mt-2 text-sm text-red-600">{errors.currentPlan}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="planStartDate" className="block text-sm font-medium text-gray-700">Plan Start Date</label>
              <input
                type="date"
                name="planStartDate"
                id="planStartDate"
                value={formData.planStartDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="planEndDate" className="block text-sm font-medium text-gray-700">Plan End Date</label>
              <input
                type="date"
                name="planEndDate"
                id="planEndDate"
                value={formData.planEndDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
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

export default EditSchoolModal;

