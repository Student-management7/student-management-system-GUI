export const validateAttendanceForm = (
    fromDate: string,
    toDate: string,
    classSelected: string,
    subjectSelected: string
  ): boolean => {
    if (!fromDate || !toDate || !classSelected || !subjectSelected) {
      console.error("Validation failed: All fields are required.");
      return false;
    }
  
    if (new Date(fromDate) > new Date(toDate)) {
      console.error("Validation failed: From date cannot be later than to date.");
      return false;
    }
  
    return true;
  };
  