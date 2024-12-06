import axios from 'axios';
import { Holiday, HolidayPayload } from '../Type/type';

const BASE_URL = 'https://s-m-s-keyw.onrender.com';

export const fetchHolidayData = async (): Promise<Holiday[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/holiday/get`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holiday data:', error);
    throw error;
  }
};

export const saveHoliday = async (payload: HolidayPayload): Promise<void> => {
  try {
    const response = await axios.post(`${BASE_URL}/holiday/save`, payload);
    if (response.status !== 200) {
      throw new Error('Failed to save holiday');
    }
  } catch (error) {
    console.error('Error submitting holiday:', error);
    throw error;
  }
};

// delete holiday Api



export const deleteHolidayApi = async (holidayId: string): Promise<void> => {
  try {
    // Include the holidayId as a query parameter
    await axios.post(`${BASE_URL}/holiday/delete`, null, {
      params: { id: holidayId },
    });
  } catch (error) {
    console.error("Failed to delete holiday:", error);
    throw new Error("Failed to delete holiday");
  }
};



