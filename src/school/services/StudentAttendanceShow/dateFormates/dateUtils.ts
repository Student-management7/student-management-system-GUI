
// change date formating 

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${
    (d.getMonth() + 1).toString().padStart(2, "0")
  }/${d.getFullYear()}`;
};

export const getDateRange = (start: string, end: string): string[] => {
  const dateArray: string[] = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

