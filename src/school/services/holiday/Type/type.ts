export interface Holiday {
    date: any;
    id: string;
    startDate: string;
    endDate: string;
    description: string;
    className: string[];
  }
  
  export interface HolidayPayload {
    className: (string | number)[];
    date: {
      id: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
  }
  