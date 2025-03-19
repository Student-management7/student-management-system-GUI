export const formatDateForPayload = (dateString: string): string => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };
  
  export const validateAttendanceForm = (date: string): boolean => {
    if (!date || date.trim() === "") {
      return false;
    }
    return true;
  };