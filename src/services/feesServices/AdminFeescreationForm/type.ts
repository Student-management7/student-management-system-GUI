export interface OtherAmount {
  name: string;
  amount: number;
}

export interface FeeFormValues {
  className: string;
  schoolFee: number;
  sportsFee: number;
  bookFee: number;
  transportation: number;
  otherAmount: OtherAmount[];
}

export interface FeeDetails extends FeeFormValues {
  id: string;
}

export interface FeesFormProps {
  initialData?: FeeFormValues;
  onSave: (values: FeeFormValues) => void;
  onCancel: () => void;
}
