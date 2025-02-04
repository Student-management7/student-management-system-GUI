import React, { useState } from 'react';

interface Inquiry {
  id: number;
  schoolName: string;
  location: string;
  adminContactInfo: string;
  inquiryDate: string;
  currentStatus: 'Interested' | 'Follow-up' | 'Converted' | 'Closed';
  notes: string;
}

interface EditInquiryStatusModalProps {
  inquiry: Inquiry;
  onClose: () => void;
  onSave: (id: number, newStatus: Inquiry['currentStatus']) => void;
}

const EditInquiryStatusModal: React.FC<EditInquiryStatusModalProps> = ({ inquiry, onClose, onSave }) => {
  const [newStatus, setNewStatus] = useState<Inquiry['currentStatus']>(inquiry.currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inquiry.id, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Inquiry Status</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-4">
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700">New Status</label>
              <select
                name="newStatus"
                id="newStatus"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Inquiry['currentStatus'])}
              >
                <option value="Interested">Interested</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
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

export default EditInquiryStatusModal;

