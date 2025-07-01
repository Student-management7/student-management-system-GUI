// Updated StudentFeesForm.tsx
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveStudentFee } from "../../../services/studentFees/api";
import axiosInstance from "../../../services/Utils/apiUtils";
import { ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeesCalculator from "./FeesCalculator";

interface Student {
  totalFee: number;
  id: string;
  name: string;
  remainingFees: number;
  email: string;
  familyDetails: {
    stdo_FatherName: string;
  };
  cls: string;

}

interface StudentFeesFormProps {
  onClose: () => void;
}

interface FormValues {
  id: string;
  fee: number;
  name: string;
  email: string;
  paymentMode: string;
}

const getValidationSchema = (remainingFees: number) => {
  return Yup.object({
    id: Yup.string().required("Student ID is required"),
    fee: Yup.number()
      .typeError("Fee must be a number")
      .required("Fee is required")
      .positive("Fee must be positive")
      .max(remainingFees, `Fee cannot exceed remaining amount (₹${remainingFees})`)
      .test("is-not-zero", "Fee amount cannot be zero", (value) => value !== 0),
    paymentMode: Yup.string().required("Payment mode is required"),
    
  });
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const StudentFeesForm: React.FC<StudentFeesFormProps> = ({ onClose }) => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading , setLoading] = useState(false)

  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error("Failed to load payment gateway. Cash payments only.");
      }
    };
    loadScript();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get("/student/findAllStudent");
        // Add default paidMonths if not present
        const studentsWithMonths = response.data.map((student: Student) => ({
          ...student,

        }));
        setStudentData(studentsWithMonths);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to fetch students. Please try again.");
      }
      finally{
        setLoading(false)
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = studentData;
    if (selectedClass) {
      filtered = filtered.filter((s) => s.cls === selectedClass);
    }
    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStudents(filtered);

    if (filtered.length === 1) {
      setSelectedStudent(filtered[0]);
    } else {
      setSelectedStudent(null);
    }
  }, [selectedClass, searchTerm, studentData]);

  const handleStudentSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const studentId = event.target.value;
    const student = filteredStudents.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setFieldValue("id", student.id);
      setFieldValue("name", student.name);
      setFieldValue("email", student.email);
      setFieldValue("fee", "");

    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (values: FormValues) => {
    try {
      if (!selectedStudent) {
        toast.error("Please select a student");
        return;
      }

      if (values.fee <= 0) {
        toast.error("Fee amount must be greater than zero");
        return;
      }

      if (values.fee > selectedStudent.remainingFees) {
        toast.error(`Fee cannot exceed remaining amount (₹${selectedStudent.remainingFees})`);
        return;
      }

      if (values.paymentMode !== 'Cash') {
        await handleRazorpayPayment(values);
        return;
      }

      // Direct save for cash payment
      const payload = {
        id: values.id,
        fee: values.fee,
        paymentMode: values.paymentMode,
      };

      console.log("Submitting fee:", payload); // Debug log
      await saveStudentFee(payload);
      toast.success("Fee added successfully!");
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Failed to save fee:", error);
      toast.error("Failed to save fee. Please try again.");
    }
  };

  // Update the Razorpay payment handler
  const handleRazorpayPayment = async (values: FormValues) => {
    
    
    try {
      if (!razorpayLoaded) {
        toast.error("Payment gateway not available. Please use cash payment.");
        return;
      }

      console.log("Initiating Razorpay payment for amount:", values.fee); // Debug log
       
      const response = await axiosInstance.post(
        '/api/payment/create-order',
        null,
        {
          params: {
            amount: values.fee,
          },
        }
        
      );

      console.log("Razorpay order response:", response.data); // Debug log

      const options = {
        key: "rzp_test_H0ZclUf9C8dmdg", // Replace with your actual key
        amount: response.data.amount,
        currency: response.data.currency,
        name: "School Fees",
        description: `Fees payment for ${values.name}`,
        order_id: response.data.id,
        handler: async function (response: any) {
          console.log("Payment success response:", response); // Debug log
          try {
            const payload = {
              id: values.id,
              fee: values.fee,
              paymentMode: values.paymentMode,
              transactionId: response.razorpay_payment_id
            };
            await saveStudentFee(payload);
            toast.success("Payment and fee record saved successfully!");
            setTimeout(() => onClose(), 1000);
          } catch (error) {
            console.error("Failed to save fee:", error);
            toast.error("Payment succeeded but failed to save record. Please contact admin.");
          }
        },
        prefill: {
          name: values.name,
          email: values.email,
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled by user");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="head1 flex items-center">
        <button onClick={onClose} className="p-2 rounded-full arrow transition">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <span className="ml-4">Add Fees Page</span>
      </div>
      <div className="container">
        <Formik
          initialValues={{
            id: selectedStudent ? selectedStudent.id : "",
            fee: 0,
            name: selectedStudent ? selectedStudent.name : "",
            email: selectedStudent ? selectedStudent.email : "",
            paymentMode: "",
          }}
          validationSchema={
            selectedStudent ? getValidationSchema(selectedStudent.remainingFees) : null
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form>
              {/* Search & Class Selection */}
              <div className="row mb-3">
                <div className="col-md-4 mb-3 col-sm-12">
                  <label className="form-label">Search by Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search student name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3 col-sm-12">
                  <label className="form-label">Filter by Class</label>
                  <select
                    className="form-select"
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {[...new Set(studentData.map((s) => s.cls))].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Selection */}
              <div className="row mb-3">
                <div className="col-md-6 col-lg-4 mb-3">
                  <label className="form-label">Select Student</label>
                  <select
                    className="form-select small-select"
                    value={selectedStudent?.id || ""}
                    onChange={(e) => handleStudentSelection(e, setFieldValue)}
                  >
                    <option value="" disabled>
                      -- Select Student --
                    </option>
                    {filteredStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Mode Dropdown */}
                <div className="col-md-6 col-lg-4 mb-3">
                  <label className="form-label">Payment Mode</label>
                  <Field
                    as="select"
                    name="paymentMode"
                    className="form-select small-select"
                  >
                    <option value="" disabled>
                      -- Select Payment Mode --
                    </option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                  </Field>
                  <ErrorMessage
                    name="paymentMode"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>

              {/* Student Details */}
              {selectedStudent && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-4">
                      <label className="form-label"> <strong>Student Name:</strong> </label>
                      <div className="info-box">{selectedStudent.name}</div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label"><strong>Father Name</strong> </label>
                      <div className="info-box">
                        {selectedStudent.familyDetails?.stdo_FatherName}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label"><strong>Remaining Fees</strong> </label>
                      <span className="info-box">
                        ₹ {selectedStudent.remainingFees}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label"><strong>Total Fees</strong> </label>
                      <span className="info-box">
                        ₹ {selectedStudent.totalFee}
                      </span>
                    </div>
                  </div>

                  {/* Fees Calculator Component */}
                  <FeesCalculator
                    totalFee={selectedStudent.totalFee}
                    remainingFees={selectedStudent.remainingFees}
                  />

                  <ErrorMessage
                    name="months"
                    component="div"
                    className="text-danger"
                  />
                </>
              )}

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="submit"
                  className="btn button"
                 
                >
                  {values.paymentMode === 'Cash' ? 'Submit Fee' : 'Proceed to Payment'}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default StudentFeesForm