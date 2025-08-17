export const validateAttendanceForm = (
  fromDate: string,
  toDate: string
): boolean => {
  if (!fromDate || !toDate) {
    alert("Please select both From Date and To Date.");
    return false;
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    alert("Invalid date format.");
    return false;
  }

  if (from > to) {
    alert("From Date cannot be later than To Date.");
    return false;
  }

  return true;
};
