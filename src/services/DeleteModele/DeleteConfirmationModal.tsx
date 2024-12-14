


import React from 'react';
import { FacultyFormData } from '../../services/Faculty/fecultyRegistretion/Type/FecultyRegistrationType';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DeleteConfirmationModalProps {
  faculty: FacultyFormData;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  faculty,
  onConfirm,
  onCancel,
  
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <div className="mb-6">
          <p>Are you sure you want to delete the following faculty member?</p>
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <p><strong>Name:</strong> {faculty.fact_Name}</p>
            <p><strong>Email:</strong> {faculty.fact_email}</p>
            <p><strong>Contact:</strong> {faculty.fact_contact}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;