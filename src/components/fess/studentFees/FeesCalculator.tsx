// components/FeesCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Field, useFormikContext } from 'formik';
import { toast } from 'react-toastify';

const months = [
  'July', 'August', 'September', 'October', 'November',
  'December', 'January', 'February', 'March', 'April'
];

interface FeesCalculatorProps {
  totalFee: number;
  remainingFees: number;
}

// components/FeesCalculator.tsx
const FeesCalculator: React.FC<FeesCalculatorProps> = ({ 
  totalFee, 
  remainingFees
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const monthlyFee = totalFee / 10;
  const paidAmount = totalFee - remainingFees;
  const paidMonthsCount = Math.min(Math.floor(paidAmount / monthlyFee), 10);

  // Calculate which months are already paid
  const paidMonths = Array.from({ length: paidMonthsCount }, (_, i) => i);

  const handleMonthSelection = (monthIndex: number) => {
    // Don't allow selection of already paid months
    if (monthIndex < paidMonthsCount) return;

    setSelectedMonths(prev => {
      // Toggle the selected month
      const newSelected = prev.includes(monthIndex)
        ? prev.filter(m => m !== monthIndex)
        : [...prev, monthIndex];
      
      // Calculate fee only for newly selected months (excluding paid months)
      const calculatedFee = newSelected.length * monthlyFee;
      setFieldValue('fee', calculatedFee);
      
      return newSelected;
    });
  };

  // Determine month status
  const getMonthStatus = (index: number) => {
    if (index < paidMonthsCount) return 'paid';
    if (selectedMonths.includes(index)) return 'selected';
    return 'pending';
  };

  return (
   <div className="mb-6">
  <h4 className="text-lg font-medium mb-4"> <strong>Monthly Fees </strong></h4>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
    {months.map((month, index) => {
      const status = getMonthStatus(index);
      const isSelected = status === 'selected';
      const isPaid = status === 'paid';

      return (
        <div
          key={month}
          onClick={() => !isPaid && handleMonthSelection(index)}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            isPaid
              ? 'bg-green-50 border-green-200 cursor-not-allowed'
              : isSelected
              ? 'bg-blue-50 border-blue-300'
              : 'bg-gray-50 border-gray-200 hover:border-blue-200'
          }`}
        >
          <h3 className="font-medium text-center">{month}</h3>
          <p className="text-sm text-gray-600 mb-1 text-center">
            Status: {isPaid ? 'Paid' : isSelected ? 'Selected' : 'Pending'}
          </p>
          <p
            className={`text-lg font-bold text-center ${
              isPaid ? 'text-green-600' : 'text-gray-700'
            }`}
          >
            ₹{monthlyFee.toLocaleString()}
          </p>
          <div className="mt-2 flex justify-center">
            {isPaid ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Pending
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>

  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700">
     <strong>Monthly Fee: ₹ </strong>  {monthlyFee.toFixed(2)}
    </label>
  </div>
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700">
     <strong>Selected Months</strong>  {selectedMonths.map(i => months[i]).join(', ') || 'None'}
    </label>
  </div>
 <div className="mb-3 flex items-center space-x-2">
  <label className="text-sm font-medium text-gray-700">
    <strong>Total Amount To Pay:</strong>
  </label>
  <span className="text-base font-semibold text-gray-900">
    ₹{(monthlyFee * selectedMonths.length).toFixed(2)}
  </span>
</div>

</div>

  );
};

export default FeesCalculator;

//