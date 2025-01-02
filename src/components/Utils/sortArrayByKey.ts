export const sortArrayByKey = <T,>(array: T[], key: keyof T): T[] => {
  const specialOrder = ["Nursery", "LKG", "UKG"]; // Define the custom order for specific strings

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
        // Compare based on the special order
        return indexA - indexB;
      } else if (indexA !== -1) {
        // `valA` is in the special order, so it should come first
        return -1;
      } else if (indexB !== -1) {
        // `valB` is in the special order, so it should come first
        return 1;
      }
    }

    // Compare numbers and strings separately
    if (isNumberA && isNumberB) {
      // Compare numerically if both are numbers
      return Number(valA) - Number(valB);
    } else if (!isNumberA && !isNumberB) {
      // Compare alphabetically if both are strings
      return String(valA).localeCompare(String(valB));
    } else {
      // Numbers come after special strings and before other strings
      return isNumberA ? -1 : 1;
    }
  });
};
