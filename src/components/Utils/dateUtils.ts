
export const formatToDDMMYYYY = (date: string): string => {
  if (!date) return ""; // Handle empty or invalid date

  const [datePart] = date.split("T");

  const [year, month, day] = datePart.split("-");

  return `${day}/${month}/${year}`;
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