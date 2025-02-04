/**
 * Converts a date to the format DD/MM/YYYY.
 * @param dateInput - The date to format (can be a Date object, string, or number).
 * @returns The formatted date string in DD/MM/YYYY format.
 */
function formatDateToDDMMYYYY(dateInput: Date | string | number): string {
    try {
      const date = new Date(dateInput);
  
      // Validate if the date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date input');
      }
  
      const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if necessary
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
      const year = date.getFullYear(); // Get year
  
      return `${day}/${month}/${year}`;
    } catch {
      console.error('Error formatting date:', );
      return 'Invalid Date';
    }
  }

  export default formatDateToDDMMYYYY