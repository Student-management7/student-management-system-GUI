
/**
 * Generates an array of dates between fromDate and toDate (inclusive)
 * @param fromDate - Start date in YYYY-MM-DD format
 * @param toDate - End date in YYYY-MM-DD format
 * @returns Array of date strings in YYYY-MM-DD format
 */
export const getDateRange = (fromDate: string, toDate: string): string[] => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const dateArray: string[] = [];

  while (start <= end) {
    const dateString = start.toISOString().split('T')[0];
    dateArray.push(dateString);
    start.setDate(start.getDate() + 1);
  }

  return dateArray;
};
