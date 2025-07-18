import { useState } from "react";
import { deleteStudentRecord } from "../../services/studentRegistration/api/StudentRegistration";
import FormView from "./FormView";
import { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType";
import AlertDialog from "../alert/AlertDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, IdCard, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/loader";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import './StudentRegistration.scss';
import { useStudentsQuery } from "../../hooks/useStudentsQuery";

const StudentRegistrationController = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(false);
  const [singleRowData, setSingleRowData] = useState<StudentFormData>();
  const [editFormView, setEditFormView] = useState(false);
  const [dialogData, setDialogData] = useState<StudentFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: students = [], isLoading, refetch } = useStudentsQuery();

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "cls", headerName: "Class" },
    { field: "gender", headerName: "Gender" },
    { field: "familyDetails.stdo_FatherName", headerName: "Father Name", nestedField: 'familyDetails.stdo_FatherName' },
    {
      field: "Edit data",
      headerName: "Edit",
      cellRenderer: (params: any) => (
        <button onClick={() => getSingleData(params.data)} className="btn btn-edit">
          <Pencil size={20} />
        </button>
      ),
    },
    {
      field: "Delete data",
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <button onClick={() => getDeleteData(params.data)}>
          <Trash2 size={20} color="red" />
        </button>
      )
    },
    {
      field: "View Details",
      headerName: "Details",
      cellRenderer: (params: any) => (
        <button className="btn btn-lg btn-view" onClick={() => handleViewDetails(params.data.id)}>
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
  ];

  const getSingleData = (data: StudentFormData) => {
    setSingleRowData(data);
    setEditFormView(true);
    setStudentData(true);
  };

  const getDeleteData = (data: StudentFormData) => {
    setDialogData(data);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dialogData?.id) return;
    try {
      await deleteStudentRecord(dialogData.id);
      toast.success("Student record deleted successfully");
      refetch(); // fetch fresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the student record. Please try again.");
    } finally {
      setIsDialogOpen(false);
      setDialogData(null);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setDialogData(null);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/StudentDetails/${id}`);
  };

  const handeleReport = (id: string) => {
    navigate(`/StudentReport/${id}`);
  };

  const handeledBulkUplade = () => {
    navigate('/bulkUpload');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="box p-3">
          {!studentData ? (
            <>
              <h1 className="head1 py-3">Student Registration</h1>
              <div className="rightButton">
                <button onClick={handeledBulkUplade} className="btn button head1 text-white mr-3">
                  Bulk Upload
                </button>
                <button onClick={() => setStudentData(true)} className="btn button head1 text-white">
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

              <ReusableTable rows={students} columns={columns} />
            </>
          ) : (
            <div className="box">
              <div className="head1">
                <h1>
                  <div>
                    <i
                      onClick={() => {
                        setStudentData(false);
                        setEditFormView(false);
                      }}
                      className="bi bi-arrow-left-circle"
                    />
                    <span className="pl-4">
                      {editFormView ? "Edit Student" : "Add Student"}
                    </span>
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
                fetchStudentDetails={refetch}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StudentRegistrationController;
