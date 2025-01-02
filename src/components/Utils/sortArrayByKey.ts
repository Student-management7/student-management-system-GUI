export const sortArrayByKey = <T,>(array: T[], key: keyof T): T[] => {
  const specialOrder = ["Nursery", "LKG", "UKG"]; 

  return [...array].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    const isNumberA = !isNaN(Number(valA));
    const isNumberB = !isNaN(Number(valB));

    // Handle special strings first
    if (specialOrder.includes(valA as string) || specialOrder.includes(valB as string)) {
      const indexA = specialOrder.indexOf(valA as string);
      const indexB = specialOrder.indexOf(valB as string);

      if (indexA !== -1 && indexB !== -1) {
       
        return indexA - indexB;
      } else if (indexA !== -1) {
        
        return -1;
      } else if (indexB !== -1) {
        
        return 1;
      }
    }

    
    if (isNumberA && isNumberB) {
      
      return Number(valA) - Number(valB);
    } else if (!isNumberA && !isNumberB) {
      return String(valA).localeCompare(String(valB));
    } else {
      return isNumberA ? -1 : 1;
    }
  });
};
