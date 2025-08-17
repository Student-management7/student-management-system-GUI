export interface FeeInfo {
  id: string;
  creationDateTime: string;
  schoolCode: string;
  fee: number;
  paymentMode: string;
}

export interface StudentData {
  month: any;
  payments: any;
  id: string;
  name: string;
  email: string;
  cls: string;
  totalFee: number;
  remainingFees: number;
  studentCode: string;
  status: string;
  feeInfo: FeeInfo[];
}

export interface FeePayment {
  month: string;
  amount: number;
  isPaid: boolean;
  dueDate: string;
}

export interface FeeSubmissionPayload {
  studentId: string;
  paymentMonths: string[];
  amountPaid: number;
  paymentDate: string;
}