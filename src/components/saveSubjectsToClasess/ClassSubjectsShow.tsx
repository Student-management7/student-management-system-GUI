import React, { useEffect, useState } from "react";
import { getClassData } from "../../services/classSubjectShow/api";
import { ClassData } from "../../services/classSubjectShow/type";
import SaveSubjectsToClasses from "./saveSubjectsToClasess";
import ReusableTable from "../MUI Table/ReusableTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/Utils/apiUtils";
import { Pencil, Trash2 } from "lucide-react";
import './saveSubject.scss'



const ClassSubjectShow: React.FC = () => {
  const [data, setData] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editableRow, setEditableRow] = useState<ClassData | null>(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getClassData();
      if (result && result.classData) {
        setData(result.classData);
      } else {
        throw new Error("Invalid response structure");
      }
      console.log("Fetched data:", data); // Log the fetched data


    } 

 
    
    catch (err: any) {
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

  const Loader = () => (
    <div className="flex items-center justify-center h-40">
      <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );

  const columns = [
    { field: "className", headerName: "Class Name" },
    { field: "subject", headerName: "Subjects" },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (row: ClassData) => (
        <div className="flex gap-2 tableButton">
         
          <button
            onClick={() => handleEdit(row)}
            
          >
          <Pencil size={20} color='orange' />
          </button>
          <button
            onClick={() => handleDelete(row)}
          >
           <Trash2 size={20} color="red" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (row: ClassData) => {
    setShowForm(true);
    setEditableRow(row);
  };

  const handleDelete = async (row: ClassData) => {
    try {
      await axiosInstance.post(`class/delete?className=${row.className}`);
      await fetchData(); // Refresh data after deletion
      toast.success(` ${row.className} class has been deleted successfully!`);
    } catch (error: any) {
      console.error("Error deleting row:", error.message || error);
      toast.error("Failed to delete the row.");
    }
  };

  const rows = data.map((item) => ({
   
    className: item.className,
    subject: Array.isArray(item.subject) ? item.subject.join(", ") : item.subject,
  }));

  const handleSave = async (updatedData: ClassData) => {
    await fetchData(); // Refresh data after save/update
    setShowForm(false);
    setEditableRow(null);
  };

  return (
    <div className="box">
      <ToastContainer />
      {!showForm ? (
        <>
          <div className="text-right mb-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Subject
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="">
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
        editableRow={editableRow as ClassData | undefined}
      />
      )}
    </div>
  );
};

export default ClassSubjectShow;