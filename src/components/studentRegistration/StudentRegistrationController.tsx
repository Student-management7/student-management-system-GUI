import React, { useState, useEffect } from "react";
import {
  getStdDetails,
  deleteStudentRecord,
} from "../../services/studentRegistration/api/StudentRegistration";
import FormView from "./FormView";
import { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType";
import EditStudentForm from "./EditStudentForm";
import AlertDialog from "../alert/AlertDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import Loader from "../loader/loader";
import ReusableTable from "../MUI Table/ReusableTable";
=======
import Loader from "../loader/loader"; // Add a Spinner component for loading
import ReusableTable from "../StudenAttendanceShow/Table/Table";
>>>>>>> d964cd0c44877685e3c80f7c5adf163f6dec739b
import BackButton from "../Navigation/backButton";

const StudentRegistrationController = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<boolean>(false);
  const [singleRowData, setSingleRowData] = useState<StudentFormData>();
  const [editFormView, setEditFormView] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<StudentFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [columns] = useState<any[]>([
    { field: "name", headerName: "Name" },
    { field: "city", headerName: "City" },
    { field: "cls", headerName: "Class" },
    { field: "gender", headerName: "Gender" },
    { field: "familyDetails.stdo_FatherName", headerName: "Father Name", nestedField: 'familyDetails.stdo_FatherName' },
    { field: "familyDetails.stdo_primaryContact", headerName: "Contact" ,  nestedField: 'familyDetails.stdo_primaryContact' },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => getSingleData(params.data)}
            className="btn btn-lg btn-edit"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => getDeleteData(params.data)}
            className="btn btn-lg btn-delete"
          >
            <Trash2 size={20} color="red" />
          </button>
        </div>
      ),
    },
    {
      field: "Report Card",
      headerName: "Report Card",
      width: 100,
      cellRenderer: (params: any) => (
        <button onClick={() => handleReport(params.data.id)}>
          <IdCard size={20} color="green" />
        </button>
      ),
    },
  ]);

  const fetchStudentDetails = async () => {
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
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const getSingleData = (data: StudentFormData) => {
    setSingleRowData(data);
    setEditFormView(true);
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

  const handleReport = (id: string) => {
    navigate("/StudentReport", {
<<<<<<< HEAD
=======

>>>>>>> d964cd0c44877685e3c80f7c5adf163f6dec739b
      state: { id },
    });
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
<<<<<<< HEAD
        <div className="box">
          {/* ✅ Back Button, Heading & Add Button (Now Above Table) */}
          <div className="flex justify-between items-center mb-4">
            <BackButton />
            <h1 className="text-xl font-bold text-[#27727A]">Student Registration</h1>
            <button
              onClick={() => setStudentData(true)}
              className="button btn text-white btn-default"
            >
              Add Student
            </button>
=======
        <div className="box ">
          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Student Registration</h1>
>>>>>>> d964cd0c44877685e3c80f7c5adf163f6dec739b
          </div>

          {!studentData ? (
            editFormView ? (
              <div className="box">
                <div className="headding1">
                  <h1 onClick={() => setEditFormView(false)}>
                    <div>
                      <i className="bi bi-arrow-left-circle" /> <span>User Edit</span>
                    </div>
                  </h1>
                </div>
                {singleRowData && <EditStudentForm singleRowData={singleRowData} />}
              </div>
            ) : (
              <>
                {/* ✅ Table Box (Now Below the Add Button) */}
                <div className="box">
                  <ToastContainer />
                  <AlertDialog
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the student record for ${dialogData?.name}?`}
                    isOpen={isDialogOpen}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancel}
                  />
                  <ReusableTable rows={data} columns={columns} />
                </div>
<<<<<<< HEAD
              </>
=======
                <ToastContainer />
                <AlertDialog
                  title="Confirm Deletion"
                  message={`Are you sure you want to delete the student record for ${dialogData?.name}?`}
                  isOpen={isDialogOpen}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancel}
                />
                <ReusableTable rows={data} columns={columns}  />
              </div>
>>>>>>> d964cd0c44877685e3c80f7c5adf163f6dec739b
            )
          ) : (
            <div className="box">
              <div className="headding1">
                <h1 onClick={() => setStudentData(false)}>
                  <div>
                    <i className="bi bi-arrow-left-circle" /> <span>User Details</span>
                  </div>
                </h1>
              </div>
              <FormView />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StudentRegistrationController;
