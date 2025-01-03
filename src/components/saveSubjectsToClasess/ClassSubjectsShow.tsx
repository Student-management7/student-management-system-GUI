import React, { useEffect, useState } from "react";
import { getClassData } from "../../services/classSubjectShow/api";
import { ClassData } from "../../services/classSubjectShow/type";
import SaveSubjectsToClasses from "./saveSubjectsToClasess";
import ReusableTable from "../MUI Table/ReusableTable"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassTable: React.FC = () => {
  const [data, setData] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch class data
  useEffect(() => {
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
      } catch (err: any) {
        console.error("Error fetching class data:", err.message || err);
        setError(err.message || "An error occurred");
        toast.error(`Error: ${err.message || "Unable to fetch data"}`);
      } finally {
        setLoading(false);
      }
    };
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
  ];

  
  const rows = data.map((item) => ({
    className: item.className,
    subject: item.subject.join(", "), 
  }));

  const handleSave = (updatedData: ClassData[]) => {
    setData(updatedData); 
    toast.success("Data updated successfully!");
    setShowForm(false);
  };

  return (
    <div className="box">
      <ToastContainer />

      {!showForm ? (
        <>
          <div className="text-right">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-default"
            >
              Add Subject
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="box">
              <ReusableTable columns={columns} rows={rows} />
            </div>
          )}
        </>
      ) : (
        <SaveSubjectsToClasses
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ClassTable;
