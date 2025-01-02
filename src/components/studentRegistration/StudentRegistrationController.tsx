import React, { useState, useEffect } from "react";
import {
  getStdDetails,
  deleteStudentRecord,
} from "../../services/studentRegistration/api/StudentRegistration";
import GridView from "./GridView";
import FormView from "./FormView";
import { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType";
import { data } from "@remix-run/router";
import EditStudentForm from "./EditStudentForm";
import AlertDialog from "../alert/AlertDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentRegistrationController = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<boolean>(false);
  const [singleRowData, setSingleRowData] = useState<StudentFormData>();
  const [editFormView, setEditFormView] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<StudentFormData | null>(null); // Store the data to delete
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility

  const [columnDefs] = useState<any[]>([
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "city", headerName: "City" },
    { field: "cls", headerName: "Class" },
    { field: "address", headerName: "Address" },
    { field: "gender", headerName: "Gender" },
    { field: "state", headerName: "State" },
    { field: "familyDetails.stdo_FatherName", headerName: "Father Name" },
    { field: "familyDetails.stdo_MotherName", headerName: "Mother Name" },
    { field: "familyDetails.stdo_primaryContact", headerName: "Contact" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      cellRenderer: (params: any) => (
        <>
          <div className="flex gap-2">
            <button
              onClick={() => getSingleData(params.data)}
              className="btn btn-lg btn-edit"
            >
              <i className="bi bi-pencil-square"></i>
            </button>

            <span></span>

            <button
              onClick={() => getDeleteData(params.data)}
              className="btn btn-lg btn-delete"
            >
              <i className="bi bi-trash text-red-600 "></i>
            </button>
          </div>
          <div></div>
        </>
      ),
    },
  ]);

  const fetchStudentDetails = async () => {
    try {
      const data = await getStdDetails();
      setRowData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const getSingleData = (data: StudentFormData) => {
    setSingleRowData(data);
    setEditFormView(true);
  };

  useEffect(() => {
    console.log("Dialog open state changed:", isDialogOpen);
  }, [isDialogOpen]);
  const getDeleteData = (data: StudentFormData) => {
    console.log("getDeleteData triggered", data); // Check if this is logged
    setDialogData(data); // Set the data for the item being deleted
    setIsDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!dialogData?.id) return;

    try {
      await deleteStudentRecord(dialogData.id); // Delete the record
      setRowData((prev) => prev.filter((row) => row.id !== dialogData.id)); // Update the rows
      toast.success("Student record deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the student record. Please try again.");
    } finally {
      setIsDialogOpen(false); // Close the dialog
      setDialogData(null); // Reset dialog data
    }
  };
  const handleCancel = () => {
    setIsDialogOpen(false); // Close the dialog without action
    setDialogData(null); // Reset dialog data
  };

  useEffect(() => {
    console.log(singleRowData);
  }, [singleRowData]);

  return (
    <>
      {!studentData ? (
        editFormView ? (
          <div className="box">
            <div className="headding1">
              <h1 onClick={() => setEditFormView(false)}>
                <div>
                  <i className="bi bi-arrow-left-circle" />{" "}
                  <span>User Edit</span>
                </div>
              </h1>
            </div>
            {singleRowData && <EditStudentForm singleRowData={singleRowData} />}
          </div>
        ) : (
          <div className="box">
            <div className="text-right">
              <button
                onClick={() => setStudentData(true)}
                className="btn btn-default"
              >
                Add Student
              </button>
            </div>
            <ToastContainer />
            <AlertDialog
              title="Confirm Deletion"
              message={`Are you sure you want to delete the student record for ${dialogData?.name}?`}
              isOpen={isDialogOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancel}
            />
            <GridView rowData={rowData} columnDefs={columnDefs} />
          </div>
        )
      ) : (
        <div className="box">
          <div className="headding1">
            <h1 onClick={() => setStudentData(false)}>
              <div>
                <i className="bi bi-arrow-left-circle" />{" "}
                <span>User Details</span>
              </div>
            </h1>
          </div>

          <FormView />
        </div>
      )}
    </>
  );
};

export default StudentRegistrationController;
