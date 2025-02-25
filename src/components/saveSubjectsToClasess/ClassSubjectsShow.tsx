import React, { useEffect, useState } from "react";
import { getClassData } from "../../services/classSubjectShow/api";
import { ClassData } from "../../services/classSubjectShow/type";
import SaveSubjectsToClasses from "./saveSubjectsToClasess";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/Utils/apiUtils";
import { Pencil, Trash2 } from "lucide-react";
import Loader from "../loader/loader";
import "./saveSubject.scss";

const ClassSubjectShow: React.FC = () => {
  const [data, setData] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editableRow, setEditableRow] = useState<ClassData | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getClassData();
      if (result && result.classData) {
        setData(result.classData);
      } else {
        toast.error("Invalid response structure");
        throw new Error("Invalid response structure");
      }
    } catch (err: any) {
      console.error("Error fetching class data:", err.message || err);
      setError(err.message || "An error occurred");
      toast.error(`Error: ${err.message || "Unable to fetch data"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit button click
  const handleEdit = (row: ClassData) => {
    setShowForm(true);
    setEditableRow(row);
  };

  // Handle delete button click
  const handleDelete = async (className: string) => {
    try {
      await axiosInstance.post(`class/delete?className=${className}`);
      await fetchData(); // Refresh data after deletion
      toast.success(`${className} class has been deleted successfully!`);
    } catch (error: any) {
      console.error("Error deleting row:", error.message || error);
      toast.error("Failed to delete the row.");
    }
  };

  // Handle save/update success
  const handleSave = async () => {
    await fetchData(); // Refresh data after save/update
    setShowForm(false);
    setEditableRow(null);
  };

  // Prepare table rows
  const rows = data.map((item) => ({
    className: item.className,
    subject: Array.isArray(item.subject) ? item.subject.join(", ") : item.subject,
  }));

  // Define table columns
  const columns = [
    { field: "className", headerName: "Class Name" },
    { field: "subject", headerName: "Subjects" },
    {
      field: "editAction",
      headerName: "Edit",
      cellRenderer: (row: ClassData) => (
        <button onClick={() => handleEdit(row)}>
          <Pencil size={20} color="orange" />
        </button>
      ),
    },
    {
      field: "deleteAction",
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <button onClick={() => handleDelete(params.data.className)}>
          <Trash2 size={20} color="red" />
        </button>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="box">
          <ToastContainer />
          {!showForm ? (
            <>
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-xl font-bold text-[#27727A]">Class Page</h1>
              </div>
              <div className="float-right mt-1">
                <button
                  onClick={() => setShowForm(true)}
                  className="button btn text-white"
                >
                  Add Subject
                </button>
              </div>
              {error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : (
                <div>
                  <ReusableTable columns={columns} rows={rows} />
                </div>
              )}
            </>
          ) : (
            <SaveSubjectsToClasses
              onClose={() => {
                setShowForm(false);
                setEditableRow(null);
              }}
              onSave={handleSave}
              editableRow={editableRow||null} 
            />
          )}
        </div>
      )}
    </>
  );
};

export default ClassSubjectShow;