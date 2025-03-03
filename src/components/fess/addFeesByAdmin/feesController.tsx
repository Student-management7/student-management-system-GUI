import React, { useState, useEffect, useCallback } from "react";
import FeesForm from "./feesForm";
import { FeeDetails } from "../../../services/feesServices/AdminFeescreationForm/type";
import { fetchFees, deleteFeeRecord } from "../../../services/feesServices/AdminFeescreationForm/api";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Loader from "../../loader/loader";
import ReusableTable from "../../MUI Table/ReusableTable";
import AlertDialog from "../../alert/AlertDialog";
import { toast, ToastContainer } from "react-toastify";

const FeesController: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [rowData, setRowData] = useState<FeeDetails[]>([]);
  const [editData, setEditData] = useState<FeeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);

  const columnDefs = [
    { headerName: "Class", field: "className", editable: false },
    { headerName: "School Fee", field: "schoolFee", editable: false },
    { headerName: "Sports Fee", field: "sportsFee", editable: false },
    { headerName: "Book Fee", field: "bookFee", editable: false },
    { headerName: "Transportation Fee", field: "transportation", editable: false },
    {
      headerName: "Other Amounts",
      field: "otherAmount",
      cellRenderer: (params: any) =>
        params.value && params.value.length
          ? params.value.map((item: any) => `${item.name}: ${item.amount}`).join(", ")
          : "0",
    },
    { headerName: "Total Fees", field: "totalFee", editable: false },
    {
      field: "edit",
      headerName: "Edit",
      cellRenderer: (params: any) => (
        <button onClick={() => handleEditButtonClick(params.data)}>
          <Pencil size={20} color="orange" />
        </button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <button onClick={() => handleDeleteButtonClick(params.data.id)}>
          <Trash2 size={20} color="red" />
        </button>
      ),
    },
  ];

  const fetchFeeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFees();
      setRowData(data);
    } catch (error) {
      toast.error("Error fetching fee details");
      console.error("Error fetching fee details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeDetails();
  }, [fetchFeeDetails]);

  const handleEditButtonClick = (data: FeeDetails) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDeleteButtonClick = (id: string) => {
    setSelectedFeeId(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!selectedFeeId) return;
    try {
      const result = await deleteFeeRecord(selectedFeeId);
      if (result.success) {
        setRowData((prevData) => prevData.filter((item) => item.id !== selectedFeeId));
        toast.success("Fee deleted successfully!");
      } else {
        toast.error("Unexpected error. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Unexpected error during deletion:", error);
    } finally {
      setShowDeleteAlert(false);
      setSelectedFeeId(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Loader />}
      {!loading && (
        <div className="box">
          {!showForm ? (
            <>
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl mb-4 font-bold text-[#27727A]">Class Fee Page</h1>
                </div>
                <span onClick={() => setShowForm(true)} className="btn button float-right">
                  Add Fee
                </span>
              </div>
              <ReusableTable rows={rowData} columns={columnDefs} />
            </>
          ) : (
            <>
              <div className="head1 flex items-center">
                <button onClick={() => setShowForm(false)} className="p-2 rounded-full arrow transition">
                  <ArrowLeft className="h-7 w-7" />
                </button>
                <span className="ml-4">Add Fees Page</span>
              </div>


              <FeesForm
                initialData={editData || undefined}
                onCancel={() => {
                  setShowForm(false);
                  setEditData(null);
                }}
                onSave={() => fetchFeeDetails()} // Refresh table after save/update

              />
            </>
          )}
        </div>
      )}
      <AlertDialog
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
        isOpen={showDeleteAlert}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteAlert(false)}
      />
    </>
  );
};

export default FeesController;