import React from 'react';
import { deleteHolidayApi } from '../Api/api';

interface DeleteHolidayProps {
  holidayId: string;
  onDelete: (holidayId: string) => void;
}

const DeleteHoliday: React.FC<DeleteHolidayProps> = ({ holidayId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete this holiday?");
      if (confirmation) {
        await deleteHolidayApi(holidayId); // Call your API here
        alert("Holiday deleted successfully.");
        onDelete(holidayId); // Notify parent about the deletion
      }
    } catch (error) {
      alert("Failed to delete holiday. Please try again.");
      console.error("Delete Error:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-danger"
    >
      Delete
    </button>
  );
};

export default DeleteHoliday;
