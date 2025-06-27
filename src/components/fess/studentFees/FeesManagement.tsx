import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../../services/Utils/apiUtils';
import BackButton from '../../Navigation/backButton';

interface StudentData {
  id: string;
  name: string;
  familyDetails: string;
  email: string;
  cls: string;
  totalFees: number;
  remainingFees: number;
  month: number;
  feeInfo: Array<{
    fee: number;
    paymentMode: string;
  }>;
}

const monthOrder = [
  'July', 'August', 'September', 'October',
  'November', 'December', 'January',
  'February', 'March', 'April'
];

interface FeeMonth {
  month: string;
  amount: number;
  isPaid: boolean;
  dueDate: string;
}

const FeesManagement = () => {
  const [studentCode, setStudentCode] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedOtherFee, setSelectedOtherFee] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Parse family details
  const familyDetails = useMemo(() => {
    try {
      return student?.familyDetails ? JSON.parse(student.familyDetails) : {};
    } catch {
      return {};
    }
  }, [student]);

  // Calculate fee structure with enhanced logic
  const { feeMonths, otherFees, perMonthFee } = useMemo(() => {
    if (!student) return { feeMonths: [], otherFees: 0, perMonthFee: 0 };

    const totalMonths = 10; // July to April
    const paidMonths = student.month;
    const remainingMonths = totalMonths - paidMonths;

    const perMonthFee = parseFloat((student.totalFees / totalMonths).toFixed(2));
    const calculatedRemaining = remainingMonths * perMonthFee;
    const apiRemaining = student.remainingFees;

    // Check if there's any discrepancy
    const otherFees = Math.max(0, apiRemaining - calculatedRemaining);

    // Create months data
    const feeMonths = monthOrder.map((month, index) => ({
      month,
      amount: perMonthFee,
      isPaid: index < paidMonths,
      dueDate: new Date(new Date().getFullYear(), 6 + index, 5).toISOString().split('T')[0]
    }));

    return { feeMonths, otherFees, perMonthFee };
  }, [student]);

  // Calculate payment amount when selection changes
  useEffect(() => {
    if (!student) return;

    const selectedAmount = feeMonths
      .filter(fm => selectedMonths.includes(fm.month) && !fm.isPaid)
      .reduce((sum, fm) => sum + fm.amount, 0);

    // Add other fees if selected
    const totalAmount = selectedAmount + (selectedOtherFee ? otherFees : 0);
    setPaymentAmount(totalAmount);
  }, [selectedMonths, feeMonths, otherFees, selectedOtherFee, student]);

  const fetchStudent = async () => {
    if (!studentCode.trim()) {
      setError('Please enter student code');
      return;
    }

    setIsLoading(true);
    setError('');
    setStudent(null);
    setSelectedMonths([]);
    setSelectedOtherFee(false);

    try {
      const response = await axiosInstance.get(`/student/getByCode?code=${studentCode}`);
      setStudent(response.data);
    } catch (err) {
      setError('Student not found or error fetching data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonths(prev =>
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const initiatePayment = async () => {
    if (!student || paymentAmount <= 0) return;

    try {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.id = 'razorpay-script';
      document.body.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => {
          document.body.removeChild(script);
          reject(new Error('Failed to load Razorpay script'));
        };
      });

      // Create order
      const orderResponse = await axiosInstance.post(
        '/api/payment/create-order',
        null,
        { params: { amount: paymentAmount } } // Convert to paise
      );

      const order = orderResponse.data;

      const options = {
        key: "rzp_test_H0ZclUf9C8dmdg",
        amount: order.amount,
        currency: order.currency,
        name: "School Management System",
        description: "Student Fee Payment",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Prepare payment record
            const paymentRecord = {
              studentId: student.id,
              monthsPaid: selectedMonths,
              amount: paymentAmount,
              paymentId: response.razorpay_payment_id,
              otherFeesPaid: selectedOtherFee ? otherFees : 0
            };

            // Save payment record
            await axiosInstance.post('/api/payments/record', paymentRecord);

            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            // Refresh student data
            await fetchStudent();
          } catch (error) {
            console.error('Error saving payment record:', error);
            alert('Payment successful but failed to update records. Please contact support.');
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      const script = document.getElementById('razorpay-script');
      if (script) document.body.removeChild(script);
    }
  };

  return (
    <div className="container mx-auto p-4">

      <div className="flex items-center space-x-4 mb-4">
        <span className='mb-2'>
          <BackButton />
        </span>
        <h1 className="head1 ">Student Fees Management</h1>
      </div>


      {/* Student Lookup */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder="Enter Student Code"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={fetchStudent}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white font-medium ${isLoading ? 'bg-gray-400' : 'button'
              }`}
          >
            {isLoading ? 'Searching...' : 'Get Details'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      {student && (
        <>
          {/* Student Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Student ID</p>
                <p className="font-medium">{student.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Father's Name</p>
                <p className="font-medium">{familyDetails.stdo_FatherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-600">Total Fees</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{student.totalFees.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600">Remaining Fees</p>
                <p className="text-2xl font-bold text-red-700">
                  ₹{student.remainingFees.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Fee Payment */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Fee Payment</h2>

            {/* Month Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
              {feeMonths.map((fm) => (
                <div
                  key={fm.month}
                  onClick={() => !fm.isPaid && handleMonthSelect(fm.month)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${fm.isPaid
                    ? 'bg-green-50 border-green-200'
                    : selectedMonths.includes(fm.month)
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-200'
                    }`}
                >
                  <h3 className="font-medium">{fm.month}</h3>
                  <p className="text-sm text-gray-600 mb-1">Due: {fm.dueDate}</p>
                  <p className={`text-lg font-bold ${fm.isPaid ? 'text-green-600' : 'text-gray-700'
                    }`}>
                    ₹{fm.amount.toLocaleString()}
                  </p>
                  <div className="mt-2">
                    {fm.isPaid ? (
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
              ))}
            </div>

            {/* Other Fees Card */}
            {otherFees > 0 && (
              <div
                className={`p-4 rounded-lg border mb-4 cursor-pointer ${selectedOtherFee
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-200'
                  }`}
                onClick={() => setSelectedOtherFee(!selectedOtherFee)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Other Fees</h3>
                    <p className="text-gray-600">Additional charges</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">₹{otherFees.toLocaleString()}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            {(selectedMonths.length > 0 || selectedOtherFee) && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2">Payment Summary</h3>
                <div className="space-y-2 mb-4">
                  {selectedMonths.length > 0 && (
                    <div>
                      <p className="font-medium">Selected Months:</p>
                      <p>{selectedMonths.join(', ')}</p>
                      <p>Amount: ₹{(selectedMonths.length * perMonthFee).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedOtherFee && (
                    <div>
                      <p className="font-medium">Other Fees:</p>
                      <p>Amount: ₹{otherFees.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <p className="text-lg font-bold">Total: ₹{paymentAmount.toLocaleString()}</p>
                  <button
                    onClick={initiatePayment}
                    className="px-4 py-2 button"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FeesManagement;