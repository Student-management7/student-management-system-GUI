// api/facultySalaryApi.ts
import { FacultySalaryFormValues } from "../facultysarayform/type";

export const saveFacultySalary = async (payload: FacultySalaryFormValues): Promise<void> => {
  try {
    // Mock API call (replace with actual API logic)
    console.log("Saving data...", payload);
  } catch (error) {
    throw new Error("Failed to save faculty salary data");
  }
};
