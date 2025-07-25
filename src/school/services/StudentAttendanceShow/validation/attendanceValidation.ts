export const validateAttendanceForm = (
  fromDate: string,
  toDate: string,
  classSelected: string,
  subjectSelected: string,
  attendanceModeLabel: string
): boolean => {
  // Base validation for common fields
  if (!fromDate || !toDate || !classSelected) {
    console.error("Validation failed: From Date, To Date, and Class are required.");
    return false;
  }

  // Attendance mode-specific validation
  if (attendanceModeLabel === "Subject-wise Attendance" && !subjectSelected) {
    console.error("Validation failed: Subject is required for Subject-wise Attendance.");
    return false;
  }

  if (attendanceModeLabel === "Master Attendance" && subjectSelected) {
    console.log("Validation passed: Subject is not required for Master Attendance.");
  }

  // Future date validation
  const today = new Date();
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);

  if (fromDateObj > today || toDateObj > today) {
    console.error("Validation failed: Dates cannot be in the future.");
    return false;
  }

  if (fromDateObj > toDateObj) {
    console.error("Validation failed: From Date cannot be after To Date.");
    return false;
  }

  return true; // All validations passed
};