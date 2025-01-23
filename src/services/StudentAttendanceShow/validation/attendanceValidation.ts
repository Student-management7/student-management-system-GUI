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

  return true; // All validations passed
};
