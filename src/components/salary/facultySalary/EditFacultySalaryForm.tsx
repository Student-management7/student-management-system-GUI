import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/Utils/apiUtils";

interface FacultyDeduction {
  name: string;
  amount: number;
}

interface FacultySalary {
  id: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: FacultyDeduction[];
}

interface EditFacultySalaryFormProps {
  initialData: FacultySalary;
  onSave: (updatedData: FacultySalary) => void;
  onCancel: () => void;
}

const EditFacultySalaryForm: React.FC<EditFacultySalaryFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FacultySalary>(initialData);
  const [deductionName, setDeductionName] = useState<string>("");
  const [deductionAmount, setDeductionAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeductionChange = () => {
    if (deductionName && deductionAmount > 0) {
      setFormData((prevData) => ({
        ...prevData,
        facultyDeduction: [...prevData.facultyDeduction, { name: deductionName, amount: deductionAmount }],
      }));
      setDeductionName("");
      setDeductionAmount(0);
    }
  };
  

  const trnsid= formData.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const payload = {
      id: formData.id,
      facultySalary: Number(formData.facultySalary),
      facultyTax: Number(formData.facultyTax),
      facultyTransport: Number(formData.facultyTransport),
      facultyDeduction: formData.facultyDeduction.map(deduction => ({
        name: deduction.name,
        amount: Number(deduction.amount)
      })),
    };
  
    try {
      await axiosInstance.post(`/faculty/salary/edit?id=${formData.id}`, payload);
      toast.success("Salary details updated successfully!");
      onSave(payload);
    } catch (error) {
      console.error("Error updating salary details:", error);
      setError("Failed to update salary details. Please try again.");
      toast.error("Failed to update salary details.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="box p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4">Edit Faculty Salary</h2>
      {error && (
        <div className="alert alert-error mb-4">
          {error}
          <button onClick={() => setError(null)} className="ml-2">
            Dismiss
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            name="facultySalary"
            value={formData.facultySalary}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Tax (%)</label>
          <input
            type="number"
            name="facultyTax"
            value={formData.facultyTax}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Transport Allowance</label>
          <input
            type="number"
            name="facultyTransport"
            value={formData.facultyTransport}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Deduction Name</label>
          <input
            type="text"
            value={deductionName}
            onChange={(e) => setDeductionName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Deduction Amount</label>
          <input
            type="number"
            value={deductionAmount}
            onChange={(e) => setDeductionAmount(Number(e.target.value))}
            className="form-control"
          />
        </div>
        <button type="button" onClick={handleDeductionChange} className="btn btn-secondary">
          Add Deduction
        </button>
        <div className="flex space-x-4 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFacultySalaryForm;
