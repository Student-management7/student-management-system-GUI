import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id?: number;
  name: string;
  role: 'Super Admin' | 'Account Manager' | 'Support';
  email: string;
  password?: string;
  assignedSchools: string[];
}

interface AddEditUserModalProps {
  user: User | null;
  onSave: (user: User) => Promise<void>;
  onClose: () => void;
}

const AddEditUserModal: React.FC<AddEditUserModalProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    role: 'Support',
    email: '',
    password: '',
    assignedSchools: [],
  });
  const [errors, setErrors] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Partial<User> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!user && !formData.password) newErrors.password = 'Password is required';
    if (formData.role !== 'Super Admin' && formData.assignedSchools.length === 0) {
      newErrors.assignedSchools = 'At least one school must be assigned';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSave(formData);
        toast.success(user ? 'User updated successfully' : 'User added successfully');
        onClose();
      } catch (error) {
        console.error('Error saving user:', error);
        toast.error('Error saving user. Please try again.');
      }
    } else {
      toast.error('Please fill in all required fields correctly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSchools = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, assignedSchools: selectedSchools }));
    setErrors(prev => ({ ...prev, assignedSchools: '' }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{user ? 'Edit User' : 'Add User'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>
          {!user && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Account Manager">Account Manager</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="assignedSchools" className="block text-sm font-medium text-gray-700">Assigned Schools</label>
            <select
              multiple
              name="assignedSchools"
              id="assignedSchools"
              value={formData.assignedSchools}
              onChange={handleSchoolChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Springfield Elementary">Springfield Elementary</option>
              <option value="Riverdale High">Riverdale High</option>
              <option value="Hogwarts School">Hogwarts School</option>
              <option value="Xavier's School for Gifted Youngsters">Xavier's School for Gifted Youngsters</option>
            </select>
            {errors.assignedSchools && <p className="mt-2 text-sm text-red-600">{errors.assignedSchools}</p>}
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
  );
};

export default AddEditUserModal;

