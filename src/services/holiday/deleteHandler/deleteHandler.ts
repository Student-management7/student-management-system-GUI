import axios from "axios";

/**
 * Delete holiday by ID
 * @param {string} id - The unique ID of the holiday to delete.
 * @param {Function} onSuccess - Callback to handle successful deletion.
 * @param {Function} onError - Callback to handle errors during deletion.
 */
export const deleteHoliday = async (
  id: string,
  onSuccess: () => void,
  onError: () => void
) => {
  if (!window.confirm("Are you sure you want to delete this holiday?")) return;

  try {
    const response = await axios.post(
      `https://s-m-s-keyw.onrender.com/holiday/delete/${id}`
    );
    if (response.status === 200) {
      alert("Holiday deleted successfully!");
      onSuccess();
    }
  } catch (error) {
    console.error("Error deleting holiday:", error);
    alert("Failed to delete holiday. Please try again.");
    onError();
  }
};
