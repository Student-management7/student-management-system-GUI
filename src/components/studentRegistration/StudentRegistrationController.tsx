import { useState, useEffect, useCallback } from "react";
import {
  getStdDetails,
  deleteStudentRecord,
} from "../../services/studentRegistration/api/StudentRegistration";
import FormView from "./FormView";
import { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType";
import AlertDialog from "../alert/AlertDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, IdCard, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/loader";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import * as XLSX from "xlsx";
import './StudentRegistration.scss';
import axiosInstance from "../../services/Utils/apiUtils";

const StudentRegistrationController = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<boolean>(false);
  const [singleRowData, setSingleRowData] = useState<StudentFormData>();
  const [editFormView, setEditFormView] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<StudentFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [columns] = useState<any[]>([
    { field: "name", headerName: "Name" },
    { field: "cls", headerName: "Class" },
    { field: "gender", headerName: "Gender" },
    { field: "familyDetails.stdo_FatherName", headerName: "Father Name", nestedField: 'familyDetails.stdo_FatherName' },
    {
      field: "Edit data",
      headerName: "Edit",
      cellRenderer: (params: any) => (
        <div className="smInline">
          <button
            onClick={() => getSingleData(params.data)}
            className="btn btn-edit"
          >
            <Pencil size={20} />
          </button>
        </div>
      ),
    },
    {
      field: "Delete data",
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <button
          onClick={() => getDeleteData(params.data)}
        >
          <Trash2 size={20} color="red" />
        </button>
      )
    },
    {
      field: "View Details",
      headerName: "Details",
      cellRenderer: (params: any) => (
        <button className="btn btn-lg btn-view"
          onClick={() => handleViewDetails(params.data.id)}
        >
          <Eye size={20} color="blue" />
        </button>
      )
    },
    {
      field: "Report Card",
      headerName: "Report Card",
      cellRenderer: (params: any) => (
        <button className="btn" onClick={() => handeleReport(params.data.id)}>
          <IdCard size={20} color="green" />
        </button>
      ),
    },
  ]);

  // Fetch student details
  const fetchStudentDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStdDetails();
      setData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch student details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  // Handle single row data for editing
  const getSingleData = (data: StudentFormData) => {
    setSingleRowData(data);
    setEditFormView(true);
    setStudentData(true);
  };
  // Handle cancel button in edit mode
  const handleCancelEdit = () => {
    setEditFormView(false); // Close edit form
    setStudentData(false); // Hide the form
  };

  const getDeleteData = (data: StudentFormData) => {
    setDialogData(data);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dialogData?.id) return;

    setLoading(true);
    try {
      await deleteStudentRecord(dialogData.id);
      setData((prev) => prev.filter((row) => row.id !== dialogData.id));
      toast.success("Student record deleted successfully.");
      fetchStudentDetails();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the student record. Please try again.");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
      setDialogData(null);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setDialogData(null);
  };

  const handeleReport = (id: string) => {
    navigate(`/StudentReport/${id}`);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/StudentDetails/${id}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.readAsBinaryString(uploadedFile);

      reader.onload = (e) => {
        const binaryData = e.target?.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const parsedData = XLSX.utils.sheet_to_json(sheet);
        console.log("Excel Converted JSON:", parsedData);
      };
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/student/bulkupload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Upload successful! `); 

      fetchStudentDetails();

    } catch (error) {
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <>
    
      {loading && <Loader />}
      {!loading && (
        <div className="container-fluid p-3">
          <div className="headding1 mb-4">
            <h1 className="text-center">Student Registration</h1>
          </div>

          {!studentData ? (
            <div>
              <div className="p-4">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 ml-2">Upload</button>
              </div>
              <div className="rightButton">
                <button
                  onClick={() => setStudentData(true)}
                  className="btn button head1 text-white"
                >
                  Add Student
                </button>
              </div>
              {isDialogOpen && dialogData && (
                <AlertDialog
                  title="Confirm Deletion"
                  message={`Are you sure you want to delete the student record for ${dialogData.name}?`}
                  isOpen={isDialogOpen}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancel}
                />
              )}
              
              <ReusableTable rows={data} columns={columns} />
            </div>
          ) : (
            <div className="box">
              <div className="head1">
                <h1>
                  <div>
                    <i
                      onClick={() => {
                        setStudentData(false);
                        setEditFormView(false); // Reset edit mode when canceling
                      }}
                      className="bi bi-arrow-left-circle"
                    />
                    <span>{editFormView ? "Edit Student" : "Add Student"}</span>
                  </div>
                </h1>
              </div>
              <FormView
                setStudentData={() => {
                  setStudentData(false);
                  setEditFormView(false);
                }}
                initialValues={editFormView ? singleRowData : undefined}
                isEdit={editFormView}
                fetchStudentDetails={fetchStudentDetails} 
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StudentRegistrationController;