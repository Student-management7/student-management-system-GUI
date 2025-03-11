
export const formatToDDMMYYYY = (date: string): string => {
  if (!date) return ""; // Handle empty or invalid date

  const [datePart] = date.split("T");

  const [year, month, day] = datePart.split("-");

  return `${day}/${month}/${year}`;
};



export const formatToDDMMYYYY1 = (dateString: string): string => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
};




const formatToDDMMYYYY2 = (dateString: string) => {
  if (!dateString) return ""; // Handle empty values
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Handle invalid dates
  return date.toLocaleDateString("en-GB"); // Converts to DD/MM/YYYY format
};




export const changeFormatToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";  // Handle null or undefined values
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
};


export const formatDate = (date: string): string => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${
    (d.getMonth() + 1).toString().padStart(2, '0')
  }/${d.getFullYear()}`;
};


export const getDateRange = (start: string, end: string): string[] => {
  const dateArray: string[] = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dateArray.push(formatDate(currentDate.toISOString().split('T')[0]));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};