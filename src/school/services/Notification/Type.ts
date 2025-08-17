export interface Notification {
    id: string;
    description: string;
    cato: string;
    className: string[];
    startDate: string;
    endDate: string;
  }
  
  export type NotificationPayload = {
    startDate: string;
    endDate: string;
    description: string;
    cato: 'Student' | 'Teacher' | 'Staff' | 'All' | 'Event' | 'Holiday' | 'Exam';
    className: string[];
  };
  